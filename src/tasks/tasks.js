const axios = require("axios");
const schedule = require("node-schedule");
const { routes } = require("../config/routes");
const router = require("../routers/user");

// TODO maybe add winston for all the api calls + tasks being executed?
const enableTasks = process.env.ENABLE_TASKS === "TRUE";

// * Fetch all tickets from specific start_time parameter and add to tickets array
const paginateResult = async (data) => {
  console.log("*********** Starting pagination ***********");
  let tickets = [];
  let tempData = {};
  tempData["data"] = data;
  tickets.push(...data.tickets);
  let page = 1;
  console.log("Page", 1);
  console.log("Tickets", tickets.length, "Date", data.end_time);

  while (!tempData.data.end_of_stream) {
    if (tempData.data.next_page) {
      page++;
      console.log("Page", page);
      const { data: data2 } = await axios({
        method: router.type,
        url: tempData.data.next_page,
      });
      tempData["data"] = data2;
      tickets.push(...data2.tickets);
      console.log("Tickets", tickets.length, "Date", tempData.data.end_time);
    }

    if (tempData.data.end_of_stream) {
      console.log("Done", tickets.length);
      return tickets;
    }
  }

  return tickets;
};

//* Get all open tickets and get ids
const getOpenTicketIds = async (URL) => {
  console.log("*********** Getting Open Tickets - Returning ids ***********");
  const { data } = await axios({
    method: router.type,
    url: URL,
  });
  const ids = await data.results.map((o) => o.id);
  return ids;
};

// * Get all tickets from specific start_time parameter before paginating
const getAllTickets = async (URL, PER_PAGE = 1000, START_TIME = 1332034771) => {
  try {
    // * Past 100 hours limit
    const dt = Math.floor((new Date().getTime() - 1000 * 360000) / 1000);

    let tickets = [];

    const { data } = await axios({
      method: router.type,
      url: URL + "?per_page=" + PER_PAGE + "&start_time=" + dt,
    });

    if (data) {
      tickets.push(...data.tickets);
      console.log("getAllTickets", data.tickets.length);
    }

    const fetchedTickets = await paginateResult(data);
    const sortedTickets = fetchedTickets.sort(
      (a, b) => b.updated_at - a.updated_at
    );
    console.log("fetchedTickets: ", sortedTickets[0], fetchedTickets[0]);
  } catch (err) {
    console.error("Error: getAllTickets", err.message);
  }
};

// * Fetch from incremental API - Returns max 1000 tickets per api call
const getIncremental = async (URL, PER_PAGE = 1000) => {
  try {
    // * Past 100 hours limit
    const dt = Math.floor(new Date().getTime() - 1000 * 86400);
    return;

    const { data } = await axios({
      method: router.type,
      url:
        URL +
        "?per_page=" +
        PER_PAGE +
        "?start_time=" +
        dt +
        "&include=comment_events",
    });
    console.log("Data", data);
  } catch (err) {
    console.error("Error: getIncremental", err.message);
  }
};

// getAllTickets("https://ubnt.zendesk.com/api/v2/incremental/tickets.json");
// getAllTickets("https://ubnt.zendesk.com/api/v2/search.json?query=type:ticket_status:open");
// getIncremental("https://ubnt.zendesk.com/api/v2/incremental/ticket_events");
getIncremental("https://ubnt.zendesk.com/api/v2/incremental/tickets/cursor");

// * Get ticket comments - accepts array of open ticket ids
const getTicketComments = async (ids) => {
  console.log("*********** Getting Tickets Comments ***********");

  let commentsArray = [];
  const moreThanTwoComments = await ids.map(async (ticket_id) => {
    const { data } = await axios({
      method: router.type,
      url: `https://ubnt.zendesk.com/api/v2/tickets/${ticket_id}/comments`,
    });
    if (data.count > 1) {
      console.log('type', typeof data.comments)
      commentsArray.push([...data.comments]);
      console.log('commentsArray', commentsArray.length)
      return data.comments;
    }
  });

  // console.log('moreThanTwoComments', Promise.all(moreThanTwoComments).then(values => console.log('Promise 1000', values)))
  return moreThanTwoComments;
};

// * Get ticket comments ID's - resolve multiple promises - return array of arrays of comment objects 
const getTicketCommentsIds = (values) => {
  console.log("*********** Getting Tickets Comments ***********");
  Promise.all(
    values.map((id) => id && id)
  ).then(values => console.log('Promise Value: ', values))
  const x = Promise.all(values).then((values) => values.map((o) => o && o.id));
};

// * Returns list of ~3k results at most (fastest)
getOpenTicketIds(
  "https://ubnt.zendesk.com/api/v2/search.json?query=type:ticket status:open"
).then((o) => getTicketComments(o).then((o) => getTicketCommentsIds(o)));

// * Automation
routes
  .filter((o) => o.automated && enableTasks)
  .forEach(async (route) => {
    const job = schedule.scheduleJob(route.interval, async () => {
      try {
        const { data } = await axios({
          method: router.type,
          url: route.route,
        });

        // console.log('data', data)
      } catch (e) {
        console.error("Error", e.message);
      }
    });
  });
