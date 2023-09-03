const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/server");
const should = chai.should();
const TuitionEvent = require("../src/models/TuitionEvent");

chai.use(chaiHttp);

describe("Calendar", () => {
  // // RETRIEVE events
  // describe("/GET events", () => {
  //   it("should GET all the events", (done) => {
  //     chai
  //       .request(app)
  //       .get("/api/events")
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         res.body.should.have.property("kind").eql("calendar#events");
  //         res.body.should.have.property("items").that.is.a("array");
  //         done();
  //       });
  //   });
  // });
  //
  // // POST events
  // describe("/POST event", () => {
  //   it("it should POST an event", (done) => {
  //     // Create an event using the TuitionEvent class
  //     const eventInstance = new TuitionEvent(
  //       "Sample Event",
  //       "5-09-23_1000",
  //       "5-09-23_1200",
  //       "Sample Location",
  //       true
  //     );
  //     chai
  //       .request(app)
  //       .post("/api/events")
  //       .send({
  //         name: "Sample Event",
  //         date_start_time: "5-09-23_1000",
  //         date_end_time: "5-09-23_1200",
  //         location: "Sample Location",
  //         lesson_is_paid: false,
  //       })
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         res.body.should.have.property("id"); // assuming the created event returns an ID
  //         res.body.should.have.property("summary").eql(eventInstance.name);
  //         // ... you can add more checks here ...
  //         done();
  //       });
  //   });
  // });
  //
  // // DELETE Event
  // describe("/DELETE event", function () {
  //   this.timeout(10000); // This will set the timeout for all tests in this describe block

  //   it("it should DELETE an event", function (done) {
  //     // 1. Create an event using the TuitionEvent class
  //     const eventInstance = new TuitionEvent(
  //       "Sample Event",
  //       "3-09-23_1000",
  //       "3-09-23_1200",
  //       "Sample Location",
  //       true
  //     );

  //     // 2. POST the event to the server
  //     chai
  //       .request(app)
  //       .post("/api/events")
  //       .send({
  //         name: "Sample Event",
  //         date_start_time: "3-09-23_1000",
  //         date_end_time: "3-09-23_1200",
  //         location: "Sample Location",
  //         lesson_is_paid: true,
  //       })
  //       .end((err, res) => {
  //         console.log("Event created with response:", res.body);
  //         res.should.have.status(200);

  //         console.log("Waiting for 5 seconds before deleting...");

  //         // Adding a delay of 5 seconds
  //         setTimeout(() => {
  //           console.log("Attempting to delete event...");
  //           // 3. DELETE the event we just created
  //           chai
  //             .request(app)
  //             .delete("/api/events")
  //             .send({
  //               name: "Sample Event",
  //               date_start_time: "2023-09-03T10:00:00+08:00",
  //               location: "Sample Location",
  //             })
  //             .end((err, deleteRes) => {
  //               deleteRes.should.have.status(200);
  //               deleteRes.body.should.have
  //                 .property("message")
  //                 .eql("Event deleted successfully");

  //               // 4. Assert that the event no longer exists.
  //               console.log("Asserted");
  //               chai
  //                 .request(app)
  //                 .get("/api/events")
  //                 .end((err, getRes) => {
  //                   getRes.should.have.status(200);
  //                   const events = getRes.body.items;
  //                   const eventExists = events.some(
  //                     (event) =>
  //                       event.summary === "Sample Event" &&
  //                       event.start.dateTime === "2023-09-03T10:00:00+08:00" &&
  //                       event.location === "Sample Location"
  //                   );
  //                   eventExists.should.be.false;
  //                   done();
  //                 });
  //             });
  //         }, 1000); // Creates a delay to give some time
  //       });
  //   });
  // });

  // PUT Test
  describe("/PUT event", function () {
    this.timeout(15000); // Setting a longer timeout for this test suite

    it("it should UPDATE an event's description to 'Paid'", function (done) {
      // 1. Create an event using the TuitionEvent class
      const eventInstance = new TuitionEvent(
        "Update Sample Event",
        "3-09-23_1400",
        "3-09-23_1600",
        "Update Sample Location",
        false
      );

      // 2. POST the event to the server
      chai
        .request(app)
        .post("/api/events")
        .send(eventInstance)
        .end((err, res) => {
          res.should.have.status(200);

          // 3. UPDATE the event we just created
          chai
            .request(app)
            .put("/api/events")
            .send({
              name: "Update Sample Event",
              date_start_time: "2023-09-03T14:00:00+08:00",
              date_end_time: "2023-09-03T16:00:00+08:00",
              location: "Update Sample Location",
              lesson_is_paid: true,
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
                  date_start_time: "2023-09-03T14:00:00+08:00",
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
