"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  let newJob = {
    title: "New job",
    salary: 650,
    equity: "0.035",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({ ...newJob, id: expect.any(Number) });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "Job1",
        salary: 100,
        equity: "0.1",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[1],
        title: "Job2",
        salary: 200,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[2],
        title: "Job3",
        salary: 300,
        equity: "0",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[3],
        title: "Job4",
        salary: null,
        equity: null,
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: by minSalary", async function () {
    let jobs = await Job.findAll({ minSalary: 200 });

    expect(jobs).toEqual([
      {
        id: testJobIds[1],
        title: "Job2",
        salary: 200,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[2],
        title: "Job3",
        salary: 300,
        equity: "0",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: by equity", async function () {
    let jobs = await Job.findAll({ hasEquity: true });

    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "Job1",
        salary: 100,
        equity: "0.1",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobIds[1],
        title: "Job2",
        salary: 200,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: by minSalary and equity", async function () {
    let jobs = await Job.findAll({ minSalary: 200, hasEquity: true });

    expect(jobs).toEqual([
      {
        id: testJobIds[1],
        title: "Job2",
        salary: 200,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });
  test("works: by title", async function () {
    let jobs = await Job.findAll({ title: "b3" });

    expect(jobs).toEqual([
      {
        id: testJobIds[2],
        title: "Job3",
        salary: 300,
        equity: "0",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  /************************************** get */

  describe("get", function () {
    test("works", async function () {
      let job = await Job.get(testJobIds[0]);
      console.log(job);
      expect(job).toEqual({
        id: testJobIds[0],
        title: "Job1",
        salary: 100,
        equity: "0.1",
        companyHandle: "c1",
      });
    });

    test("not found if no such job", async function () {
      try {
        await Job.get(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** update */

  describe("update", function () {
    let updateData = {
      title: "New Job1",
      salary: 1000,
      equity: "0.11",
    };

    test("works", async function () {
      let job = await Job.update(testJobIds[0], updateData);
      expect(job).toEqual({
        id: testJobIds[0],
        handle: "c1",
        companyHandle: "c1",
        ...updateData,
      });
    });

    test("not found if no such job", async function () {
      try {
        await Job.update(testJobIds[0], updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

    test("bad request with no data", async function () {
      try {
        await Job.update(testJobIds[0], {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  /************************************** remove */

  describe("remove", function () {
    test("works", async function () {
      await Job.remove(testJobIds[0]);
      const res = await db.query("SELECT id FROM jobs WHERE id='1'");
      expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
      try {
        await Job.remove(testJobIds[0]);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
