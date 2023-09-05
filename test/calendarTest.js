const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/server");
const should = chai.should();
const TuitionEvent = require("../src/models/TuitionEvent");

// Generating dates for test cases
// Function to return the date in the ISO format
function todayAtTimeISO(time) {
  // Get the current date parts
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-11, hence the +1
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day}T${time}:00:00+08:00`;
}

// Function to return the date in the custom format
function todayAtTimeCustom(time) {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().substr(-2);
  return `${day}-${month}-${year}_${time}00`;
}

// Usage:
const startDateTimeToCheck = todayAtTimeISO(10);
const nonFormattedStartDate = todayAtTimeCustom(10);
const nonFormattedEndDate = todayAtTimeCustom(12);

chai.use(chaiHttp);

describe("Calendar", () => {
  /**
   * Test the /GET route
   * This test will retrieve all events from the Google Calendar API.
   */
  describe("/GET events", () => {
    it("should GET all the events", (done) => {
      chai
        .request(app)
        .get("/api/events")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("kind").eql("calendar#events");
          res.body.should.have.property("items").that.is.a("array");
          done();
        });
    });
  });

  /**
   * Test the /POST route
   * This test will try to create a new event in the Google Calendar API using the provided details.
   */
  describe("/POST event", () => {
    it("it should POST an event", (done) => {
      chai
        .request(app)
        .post("/api/events")
        .send({
          name: "Sample Event",
          date_start_time: nonFormattedStartDate,
          date_end_time: nonFormattedEndDate,
          location: "Sample Location",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id"); // assuming the created event returns an ID
          res.body.should.have.property("summary").eql("Sample Event");
          // ... you can add more checks here ...
          done();
        });
    });
  });
  /** IMPORTANT: THIS ROUTE IS FUCKED UP RIGHT NOW, UNSURE WHY THIS TEST DONT RUN WHEN THE RESTS ARE RUNNING. SEND HELP
   * Test the /DELETE route
   * This test performs the following steps:
   * 1. Create an event.
   * 2. Delete the event.
   * 3. Confirm that the event no longer exists.
   */
  describe("/DELETE event", function () {
    this.timeout(10000); // This will set the timeout for all tests in this describe block
    it("it should DELETE an event", function (done) {
      // 1. POST the event to the server
      chai
        .request(app)
        .post("/api/events")
        .send({
          name: "Sample Event",
          date_start_time: nonFormattedStartDate,
          date_end_time: nonFormattedEndDate,
          location: "Sample Location",
        })
        .end((err, res) => {
          console.log("Event created with response:", res.body);
          res.should.have.status(200);
          console.log("Waiting for 5 seconds before deleting...");
          // Adding a delay of 5 seconds
          setTimeout(() => {
            console.log("Attempting to delete event...");
            // 2. DELETE the event we just created
            chai
              .request(app)
              .delete("/api/events")
              .send({
                name: "Sample Event",
                date_start_time: nonFormattedStartDate,
                location: "Sample Location",
              })
              .end((err, deleteRes) => {
                deleteRes.should.have.status(200);
                deleteRes.body.should.have
                  .property("message")
                  .eql("Event deleted successfully");
                // 3. Assert that the event no longer exists.
                console.log("Asserted");
                chai
                  .request(app)
                  .get("/api/events")
                  .end((err, getRes) => {
                    getRes.should.have.status(200);
                    const events = getRes.body.items;
                    const eventExists = events.some(
                      (event) =>
                        event.summary === "Sample Event" &&
                        event.start.dateTime === startDateTimeToCheck &&
                        event.location === "Sample Location"
                    );
                    eventExists.should.be.false;
                    done();
                  });
              });
          }, 1000); // Creates a delay to give some time
        });
    });
  });
  /**
   * Test the /PUT route
   * This test performs the following steps:
   * 1. Create an event.
   * 2. Update the event's description to 'Paid'.
   * 3. Confirm that the event's description has been updated.
   * 4. Cleanup by deleting the event.
   */
  describe("/PUT event", function () {
    this.timeout(15000);
    it("it should UPDATE an event's description to 'Paid'", function (done) {
      // 1. POST the event to the server
      chai
        .request(app)
        .post("/api/events")
        .send({
          name: "Update Sample Event",
          date_start_time: nonFormattedStartDate,
          date_end_time: nonFormattedEndDate,
          location: "Update Sample Location",
        })
        .end((err, res) => {
          console.log("Post Successful");
          res.should.have.status(200);
          // 2. UPDATE the event we just created
          chai
            .request(app)
            .put("/api/events")
            .send({
              name: "Update Sample Event",
              location: "Update Sample Location",
              date_start_time: nonFormattedStartDate,
            })
            .end((err, updateRes) => {
              updateRes.should.have.status(200);
              updateRes.body.description.should.eql("Paid");
              // 4. DELETE the event to cleanup
              chai
                .request(app)
                .delete("/api/events")
                .send({
                  name: "Update Sample Event",
                  date_start_time: nonFormattedStartDate,
                  location: "Update Sample Location",
                })
                .end((err, deleteRes) => {
                  deleteRes.should.have.status(200);
                  done();
                });
            });
        });
    });
  });
});
