const axios = require("axios");
require("dotenv").config();
axios.defaults.baseURL = process.env.ZENDESK_TEST_URL;
axios.defaults.headers.common["Authorization"] = process.env.TEST_AUTH_BASIC;
axios.defaults.headers.put["Content-Type"] = "application/json";

const sleep = (ms = 6000) => new Promise((resolve) => setTimeout(resolve, ms));

// ! So far limit is at 1000 - can extend
const getTicketsAndAddTags = async () => {
  let ids = [];
  let idObject = {};
  let tempData = {};
  let limit = false;
  let page = 1;
  let requests = 1;

  // * 1. Get all open tickets
  const { data } = await axios.get(
    "/search.json?query=type:ticket status:open"
  );

  requests++;
  tempData["data"] = data;
  console.log("Open tickets: ", tempData.data.count);
  console.log("Page", page);

  // * 2. Get ids
  data.results.map((ticket) =>
    ids.push({ ticket_id: ticket.id, requester_id: ticket.requester_id })
  );
  console.log("Number of ids: ", ids.length);

  // * 3. Pagination
  while (tempData && tempData.data && tempData.data.next_page) {
    page++;
    console.log("Page: ", page);

    // Note: The API returns 422 for pages past 11
    if (page == 11) {
      limit = true;
      console.log("Exiting loop");
      break;
    }

    await axios
      .get(tempData.data.next_page)
      .then((o) => {
        requests++;
        return (tempData["data"] = o.data);
      })
      .catch((e) => {
        limit = true;
        console.error("Error getTicketsAndAddTags", e.message);
      });

    tempData.data.results.map((ticket) =>
      ids.push({ ticket_id: ticket.id, requester_id: ticket.requester_id })
    );
    console.log("Number of ids: ", ids.length);
  }

  // * 4. Get tickets by id + get ticket comments
  if (limit) {
    let comments = [];

    for (let i = 0; i < 10; i++) {
      if (i % 600 === 0) {
        console.log("Sleep: 60 seconds");
        await sleep(60000);
      }

      const { data } = await axios.get(`/tickets/${ids[i].ticket_id}/comments`);

      // * 5. Filter by 2+comments
      if (data.comments.length >= 2) {
        // * Comment is by same author as ticket
        let same = 0;

        const parsedData = data.comments.map((comment) => {
          const newObj = {};
          newObj["id"] = comment["id"];
          newObj["author_id"] = comment["author_id"];
          newObj["ticket_id"] = ids[i].ticket_id;

          if (comment.author_id == ids[i].requester_id) {
            same++;
          }
          return newObj;
        });

        if (same >= 2) {
          comments.push(parsedData);
          console.log("Comments: ", comments.length);
        }
      }
    }

    // ! Snip array at 100 items, stringify and make request
    // console.log(comments.splice(0, 100));
    const uniqueIds = comments.map((a) => {
      return a[0].ticket_id;
    });
    
    console.log("Adding tag to tickets: ", uniqueIds);
    console.log(comments, comments.length);
    
    // * /api/v2/tickets/update_many: Accepts a comma-seperated list of up to 100 ticket ids,
    axios
      .put(`/tickets/update_many.json?ids=${uniqueIds}`, {
        ticket: { additional_tags: ["comments_2x"] },
      })
      .then((o) => {
        console.log("Success: ", o.status);
      })
      .catch((e) => {
        console.error("Error: tag", e.message);
      });
  }
};

getTicketsAndAddTags();
