// credit: https://github.com/VikeLabs/courseup
export interface NestedPreCoRequisites {
    reqList?: (NestedPreCoRequisites | KualiCourse | string)[];
    unparsed?: string;
    gpa?: string;
    grade?: string;
    units?: boolean;
    coreq?: boolean;
    quantity?: number | 'ALL';
}

// credit: https://github.com/VikeLabs/courseup
export interface CourseDetails {
    pid: string;
    title: string;
    description: string;
    dateStart: string;
    credits: {
      chosen: string;
      value:
        | string
        | {
            max: string;
            min: string;
          };
      credits: {
        max: string;
        min: string;
      };
    };
    hoursCatalog?: {
      lab: string;
      tutorial: string;
      lecture: string;
    }[];
    preAndCorequisites?: (string | NestedPreCoRequisites | KualiCourse)[];
    preOrCorequisites?: (string | NestedPreCoRequisites | KualiCourse)[];
    /**
     * Abbriviation of the subject of the course.
     */
    subject: string;
    /**
     * The code portion of the course.
     */
    code: string;
    /**
     * If a course was named something else previously.
     */
    formally?: string;
}

// credit: https://github.com/VikeLabs/courseup
export interface Course {
    pid:     string;
    title:   string;
    subject: string;
    code:    string;
}  

export interface CoursePostreqs {
    [index: string]: Course[];
}