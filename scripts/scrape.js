// import fs from "node:fs";

// Shoutouts to VikeLabs for having this awesome API!!!
const VIKELABS_URL = "https://courseup.vikelabs.ca/api/courses/";

// update each term
const CURRENT_TERM = "202305";

async function getCourseData(courseCatalogJson) {
    let courseData = {};

    const promises = courseCatalogJson.map((course) =>
        fetch(VIKELABS_URL + CURRENT_TERM + '/' + course.subject + '/' + course.code)
        .then((response) => response.ok ? response.json() : null)
        .then((course) => course === null ? console.log("Failed to fetch data for a course!") : (courseData[course.subject + course.code] = course))
    ); 
    await Promise.all(promises);
    return courseData;
}

function parsePreCorequisites(coursePostreqData, course, preCoreqList) {
    preCoreqList.map((preCoreq) => {
        if (typeof preCoreq === 'string' || preCoreq instanceof String) {
            return;
        }
        // KualiCourse
        if ("code" in preCoreq) {
            const courseName = preCoreq["subject"] + preCoreq["code"];
            const coursePostreq = {
                "subject": course.subject,
                "code":    course.code,
                "pid":     course.pid,
                "title":   course.title
            };

            courseName in coursePostreqData ? coursePostreqData[courseName].push(coursePostreq) : coursePostreqData[courseName] = [coursePostreq];
        }

        // NestedpreCorequisite
        // dont bother with any info other than the course (for now)
        if ("reqList" in preCoreq) {
            parsePreCorequisites(coursePostreqData, course, preCoreq.reqList);
        }
    })
}

function classifyCoursePostreqs(course, coursePostreqData) {
    if ("preAndCorequisites" in course) {
        parsePreCorequisites(coursePostreqData, course, course.preAndCorequisites);
    }

    if ("preOrCorequisites" in course) {
        parsePreCorequisites(coursePostreqData, course, course.preOrCorequisites);
    }
}

function classifyAllCoursePostreqs(courseData) {
    let coursePostreqData = {};

    Object.values(courseData).map((course) => classifyCoursePostreqs(course, coursePostreqData));

    return coursePostreqData;
}

const startTime = performance.now();

// Get catalog info for the current term
console.log("Fetching course catalog info...");
const courseCatalogJson = await fetch(VIKELABS_URL + CURRENT_TERM).then((response) => response.json());
Bun.write("course-catalog.json", JSON.stringify(courseCatalogJson))
// fs.writeFileSync("course-catalog.json", JSON.stringify(courseCatalogJson));

// // Fetch detailed course data from catalog entries
console.log("Fetching detailed course info...");
const courseData = await getCourseData(courseCatalogJson);
// fs.writeFileSync("course-data.json", JSON.stringify(courseData));
Bun.write("course-data.json", JSON.stringify(courseData))

// const courseData = JSON.parse(fs.readFileSync("course-data.json"))

// Now that we have the detailed course data, we can classify postreqs
console.log("Classifying postreqs...");
const coursePostreqs = classifyAllCoursePostreqs(courseData);
// fs.writeFileSync("course-postreqs.json", JSON.stringify(coursePostreqs));
Bun.write("course-postreqs.json", JSON.stringify(coursePostreqs))

const metadata = { "scrapedAt": new Date().toISOString(), };
// fs.writeFileSync("metadata.json", JSON.stringify(metadata));
Bun.write("metadata.json", JSON.stringify(metadata))

console.log("Finished at " + metadata.scrapedAt + "!");

console.log("Total time: " + (performance.now() - startTime) + "ms")