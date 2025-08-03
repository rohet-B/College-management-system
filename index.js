const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}.`);
});

// SETTING UP ENV FILE TO PROTECT SENSITIVE PASSWORDS AND ALL
// 1. install dotenv -> npm install dotenv
// 2. require('dotenv').config();

require('dotenv').config();

// Configuring Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(
    {
        service:"gmail",
        secure:true,
        host:'smtp@gmail.com',
        port:465,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    }
);
function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });
}
function sendFile(to,sub,msg,filePath){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg,
        attachments: [
            {
                filename: filePath.split("/").pop(), // extract file name
                path: filePath
            }
        ]
    });
}

// Linking Views
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

// Parsing the POST request data
app.use(express.urlencoded({extended:true}));

// app.use("/",(req,res)=>{
//     res.send("Hello");
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// First Route -> Login route
app.get('',(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "login.html"));
});
// Sub-login routes
// 1. Route that shows a form (GET METHOD) and Another route that takes data from forms and use it further (POST METHOD)
app.get('/admin/login',(req,res)=>{
    res.render('admin-login.ejs');
});

// Database
let admins=[
    {
        First_name:"Rohit",
        Last_name:"Biswash",
        username_with_num:process.env.ADMIN_USERNAME_AND_NUM,
        password:process.env.ADMIN_PASS,
    }
];
let students = [
  {
    Full_name: "Namo Narayan Shukla",
    user_name: "namonarayan",
    password: "namo123",
    course: "BCA",
    subjects_with_assessments: [
      {
        subject: "JAVA PROGRAMMING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 8 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 11 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 42, absent: 7, holiday: 6 }
      },
      {
        subject: "SOFTWARE ENGINEERING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 7 },
          { type: "ASSIGNMENTS 3", marks: 6 },
          { type: "ASSIGNMENTS 4", marks: 8 },
          { type: "Practice Test", marks: 10 },
          { type: "Mock Exam", marks: 12 },
          { type: "Internal Exam (Written)", marks: 16 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 33 }
        ],
        attendance: { present: 40, absent: 8, holiday: 7 }
      },
      {
        subject: "INTRO TO MNGMNT & ENTRE DEV",
        assessments: [
          { type: "PPT Marks", marks: 8 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 6 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 16 },
          { type: "External Exam", marks: 35 }
        ],
        attendance: { present: 41, absent: 6, holiday: 8 }
      },
      {
        subject: "WEB DEVELOPMENT WITH PYTHON",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 8 },
          { type: "ASSIGNMENTS 2", marks: 7 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 19 },
          { type: "External Exam", marks: 37 }
        ],
        attendance: { present: 43, absent: 5, holiday: 7 }
      },
      {
        subject: "DIGITAL MARKETING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 8 },
          { type: "Practice Test", marks: 11 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 16 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 34 }
        ],
        attendance: { present: 39, absent: 8, holiday: 8 }
      }
    ],
    Year: "3",
    semester: "5",
    studentID: "S101",
    gender: "Male",
    dob: "2005-01-08",
    gmail: "namoshukla96@gmail.com"
  },
  {
    Full_name: "Chaitanya Rohtela",
    user_name: "chaitanya",
    password: "chaitu123",
    course: "BCA",
    subjects_with_assessments: [
      {
        subject: "JAVA PROGRAMMING",
        assessments: [
          { type: "PPT Marks", marks: 7 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 10 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 41, absent: 6, holiday: 7 }
      },
      {
        subject: "SOFTWARE ENGINEERING",
        assessments: [
          { type: "PPT Marks", marks: 8 },
          { type: "ASSIGNMENTS 1", marks: 8 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 8 },
          { type: "Practice Test", marks: 10 },
          { type: "Mock Exam", marks: 11 },
          { type: "Internal Exam (Written)", marks: 15 },
          { type: "Internal Exam (Viva)", marks: 16 },
          { type: "External Exam", marks: 32 }
        ],
        attendance: { present: 39, absent: 9, holiday: 6 }
      },
      {
        subject: "INTRO TO MNGMNT & ENTRE DEV",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 7 },
          { type: "ASSIGNMENTS 2", marks: 8 },
          { type: "ASSIGNMENTS 3", marks: 6 },
          { type: "ASSIGNMENTS 4", marks: 7 },
          { type: "Practice Test", marks: 9 },
          { type: "Mock Exam", marks: 12 },
          { type: "Internal Exam (Written)", marks: 15 },
          { type: "Internal Exam (Viva)", marks: 15 },
          { type: "External Exam", marks: 33 }
        ],
        attendance: { present: 38, absent: 10, holiday: 6 }
      },
      {
        subject: "WEB DEVELOPMENT WITH PYTHON",
        assessments: [
          { type: "PPT Marks", marks: 8 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 9 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 19 },
          { type: "External Exam", marks: 38 }
        ],
        attendance: { present: 42, absent: 7, holiday: 5 }
      },
      {
        subject: "DIGITAL MARKETING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 10 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 11 },
          { type: "Mock Exam", marks: 12 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 40, absent: 8, holiday: 6 }
      }
    ],
    Year: "3",
    semester: "5",
    studentID: "S102",
    gender: "Male",
    dob: "2003-11-07",
    gmail: "chetanbaghel456@gmail.com"
  },
  {
    Full_name: "Satyam Lakhera",
    user_name: "satyam",
    password: "satyam123",
    course: "BCA",
    subjects_with_assessments: [
      {
        subject: "JAVA PROGRAMMING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 14 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 37 }
        ],
        attendance: { present: 44, absent: 4, holiday: 6 }
      },
      {
        subject: "SOFTWARE ENGINEERING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 8 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 8 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 16 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 34 }
        ],
        attendance: { present: 42, absent: 6, holiday: 6 }
      },
      {
        subject: "INTRO TO MNGMNT & ENTRE DEVELOPMENT",
        assessments: [
          { type: "PPT Marks", marks: 8 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 10 },
          { type: "ASSIGNMENTS 3", marks: 6 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 16 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 43, absent: 5, holiday: 6 }
      },
      {
        subject: "WEB DEVELOPMENT WITH PYTHON",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 8 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 19 },
          { type: "Internal Exam (Viva)", marks: 19 },
          { type: "External Exam", marks: 38 }
        ],
        attendance: { present: 41, absent: 8, holiday: 5 }
      },
      {
        subject: "DIGITAL MARKETING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 40, absent: 7, holiday: 7 }
      }
    ],
    Year: "3",
    semester: "5",
    studentID: "S103",
    gender: "Male",
    dob: "2005-06-08",
    gmail: "satyamlakhera43@gmail.com"
  },
  {
    Full_name: "Rudraksh Sharma",
    user_name: "rudraksh",
    password: "rudra123",
    course: "BCA",
    subjects_with_assessments: [
      {
        subject: "JAVA PROGRAMMING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 10 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 14 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 19 },
          { type: "External Exam", marks: 39 }
        ],
        attendance: { present: 45, absent: 4, holiday: 5 }
      },
      {
        subject: "SOFTWARE ENGINEERING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 8 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 16 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 35 }
        ],
        attendance: { present: 43, absent: 6, holiday: 5 }
      },
      {
        subject: "INTRO TO MNGMNT & ENTRE DEVELOPMENT",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 8 },
          { type: "ASSIGNMENTS 3", marks: 7 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 16 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 42, absent: 7, holiday: 6 }
      },
      {
        subject: "WEB DEVELOPMENT WITH PYTHON",
        assessments: [
          { type: "PPT Marks", marks: 8 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 10 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 37 }
        ],
        attendance: { present: 41, absent: 7, holiday: 7 }
      },
      {
        subject: "DIGITAL MARKETING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 8 },
          { type: "ASSIGNMENTS 2", marks: 10 },
          { type: "ASSIGNMENTS 3", marks: 9 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 36 }
        ],
        attendance: { present: 40, absent: 8, holiday: 7 }
      }
    ],
    Year: "3",
    semester: "5",
    studentID: "S104",
    gender: "Male",
    dob: "2005-07-26",
    gmail: "rudrakshradhey@gmail.com"
  },
  {
    Full_name: "Akshita Grover",
    user_name: "akshita",
    password: "akshi123",
    course: "BCA",
    subjects_with_assessments: [
      {
        subject: "JAVA PROGRAMMING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 9 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 14 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 19 },
          { type: "External Exam", marks: 39 }
        ],
        attendance: { present: 45, absent: 4, holiday: 5 }
      },
      {
        subject: "SOFTWARE ENGINEERING",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 10 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 37 }
        ],
        attendance: { present: 44, absent: 5, holiday: 5 }
      },
      {
        subject: "INTRO TO MNGMNT & ENTRE DEVELOPMENT",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 9 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 8 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 12 },
          { type: "Mock Exam", marks: 13 },
          { type: "Internal Exam (Written)", marks: 16 },
          { type: "Internal Exam (Viva)", marks: 17 },
          { type: "External Exam", marks: 35 }
        ],
        attendance: { present: 42, absent: 6, holiday: 6 }
      },
      {
        subject: "WEB DEVELOPMENT WITH PYTHON",
        assessments: [
          { type: "PPT Marks", marks: 10 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 9 },
          { type: "ASSIGNMENTS 3", marks: 9 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 14 },
          { type: "Mock Exam", marks: 14 },
          { type: "Internal Exam (Written)", marks: 18 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 38 }
        ],
        attendance: { present: 43, absent: 6, holiday: 5 }
      },
      {
        subject: "DIGITAL MARKETING",
        assessments: [
          { type: "PPT Marks", marks: 9 },
          { type: "ASSIGNMENTS 1", marks: 10 },
          { type: "ASSIGNMENTS 2", marks: 10 },
          { type: "ASSIGNMENTS 3", marks: 9 },
          { type: "ASSIGNMENTS 4", marks: 9 },
          { type: "Practice Test", marks: 13 },
          { type: "Mock Exam", marks: 15 },
          { type: "Internal Exam (Written)", marks: 17 },
          { type: "Internal Exam (Viva)", marks: 18 },
          { type: "External Exam", marks: 37 }
        ],
        attendance: { present: 41, absent: 7, holiday: 6 }
      }
    ],
    Year: "3",
    semester: "5",
    studentID: "S105",
    gender: "Female",
    dob: "2005-03-15",
    gmail: "akshitagrover294@gmail.com"
  }
];
let teachers=[
    {
        Full_name:"Mr. Anil k.Gupta",
        password:"KIHEAT-1",
        username:"akgupta",
        teacherID:"T101",
        subjects_assigned: [{name:"JAVA PROGRAMMING",course:"BCA",semester:"5",year:"3"},{name:"COMPUTER BASICS",course:"BCOM",semester:"2",year:"1"},{name:"C++",course:"BCA",semester:"2",year:"1"}],
        years_of_experience: 5,
        joining_date: "2020-08-01",
        department: "Computer Science",
        dob: "1985-08-21",
        gender:"Male",
        status: "Active",
        gmail:"rohitbiswash27@gmail.com"
    },
    {
        Full_name:"Mrs. Suma",
        password:"KIHEAT-2",
        username:"ssuma",
        teacherID:"T102",
        subjects_assigned: [{name:"DISCRETE MATHEMATICS",course:"BCA",semester:'4',year:"2"},{name:"BUSINESS MATHS",course:"BCOM",semester:'5',year:"3"}],
        years_of_experience: 10,
        joining_date: "2019-08-01",
        department: "Computer Science",
        dob: "1980-05-15",
        gender:"Female",
        status: "Active",
        gmail:"rohitbiswash27@gmail.com"
    }
];

// Route that takes data from forms and further process it (POST METHOD)
app.post('/administrator/login',(req,res)=>{
    let {password,username_with_num} = req.body;
    let found = false;
    for(let i =0;i<admins.length;i++){
        if(
            admins[i].username_with_num === username_with_num &&
            admins[i].password === password
        )
        {
            found = true;
            // res.send(`Welcome, ${First_name} ${Last_name}!`);
            res.render("admin-dash.ejs",{admin_first_name:admins[i].First_name,admin_last_name:admins[i].Last_name,total_stu:students.length,total_teacher:teachers.length});
            break;
        }
    }
    if (!found) {
    res.send("Invalid credentials. Access denied.");
  }
});

// Route to create new admin account 
app.get('/administrator/create',(req,res)=>{
    res.render('admin-create.ejs');
});

// Now new admin account creation form will sent request to this route
let admin_key=process.env.ADMIN_SECRET_KEY;
app.post('/administrator/create',(req,res)=>{
    let {First_name,Last_name,password,special_key,username_with_num} = req.body;
    if(special_key == admin_key)
    {
        admins.push(
            {
                First_name:First_name,
                Last_name:Last_name,
                password:password

            }
        )
        res.render('admin-dash.ejs',{admin_first_name:First_name,admin_last_name:Last_name,total_stu:students.length,total_teacher:teachers.length});
    }
    else{
        res.send("Invalid Key. Creation of admin account is denied.");
    }
});


// PROBLEM OCCURED HERE AND HOW I SOLVED IT
// You have 2 forms:

// One for Admin Login.

// One for Admin Account Creation.

// But both forms are sending data to the same route:

// POST /administrator/dashboard
// Because of this, only one of the two things is working — the login one, and the account creation is getting ignored.

// ✅ What to do?
// We will give each form its own separate route to handle it.ONE IS POST / administrator/login & /administrator/create
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Route to manage the students and teachers
app.get('/admin/students', (req, res) => {
    const { course, semester } = req.query;
    let filteredStudents = students;

    // Filter by course
    if (course && course !== 'All') {
        filteredStudents = filteredStudents.filter(s => s.course === course);
    }

    // Filter by semester
    if (semester && semester !== 'All') {
        filteredStudents = filteredStudents.filter(s => s.semester === semester);
    }

    const courseList = [...new Set(students.map(s => s.course))];
    const semesterList = [...new Set(students.map(s => s.semester))].sort((a, b) => parseInt(a) - parseInt(b));

    res.render("admin-students", {
        students: filteredStudents,
        courses: courseList,
        semesters: semesterList,
        selectedCourse: course || "All",
        selectedSemester: semester || "All"
    });
});
// ----------------------------------------------------------------------------
// We extract the numeric part from each student ID (removing the S).

// Use Math.max() to find the highest ID assigned so far.

// 100 is the fallback in case the array is empty (ensures next becomes S101).

// This means: If last was S105, next will be S106.

// Sub routes to manage students i.e Adding new student
let nextStudentNumber = Math.max(
  ...students.map(s => parseInt(s.studentID.slice(1))), // Extract numeric part (e.g., 101)
  100 // default fallback if no students exist
);
app.get('/admin/students/new', (req, res) => {
  const nextID = `S${nextStudentNumber + 1}`;  // preview upcoming ID
  res.render("student-new.ejs", { nextID });  // send it to form
});
// Default assessments
const defaultAssessments = [
  { type: "PPT Marks", marks: 0 },
  { type: "ASSIGNMENTS 1", marks: 0 },
  { type: "ASSIGNMENTS 2", marks: 0 },
  { type: "ASSIGNMENTS 3", marks: 0 },
  { type: "ASSIGNMENTS 4", marks: 0 },
  { type: "Practice Test", marks: 0 },
  { type: "Mock Exam", marks: 0 },
  { type: "Internal Exam (Written)", marks: 0 },
  { type: "Internal Exam (Viva)", marks: 0 },
  { type: "External Exam", marks: 0 }
];


app.post('/admin/students', (req, res) => {
  nextStudentNumber++;
  const newStudentID = `S${nextStudentNumber}`;

  const rawSubjects = req.body.subjects || [];

  const subjects_with_assessments = rawSubjects.map(subject => ({
    subject: subject.subject,
    assessments: defaultAssessments.map(a => ({ ...a })),  // deep copy
    attendance: {
      present: parseInt(subject.attendance?.present || 0),
      absent: parseInt(subject.attendance?.absent || 0),
      holiday: parseInt(subject.attendance?.holiday || 0)
    }
  }));

  const newStudent = {
    studentID: newStudentID,
    Full_name: req.body.Full_name,
    gender: req.body.gender,
    dob: req.body.dob,
     user_name: req.body.user_name,          // <- add this
  password: req.body.password,
  Year: req.body.Year,                    // <- add this
  semester: req.body.semester, 
    gmail: req.body.gmail.toLowerCase(),
    course: req.body.course.toUpperCase(),
    subjects_with_assessments
  };

  students.push(newStudent);  // Assuming `students` is your main array

  sendMail(`${newStudent.gmail}`,"Welcome to the University!",
         `
  <h2>🎉 Welcome to the University!</h2>
  <p>Dear ${newStudent.Full_name},</p>
  <p>We are excited to welcome you to our university community! Your student account has been successfully created.</p>

  <p>You can now access the student portal and explore your dashboard using the following login details:</p>

  <ul>
    <li><strong>Student ID:</strong> ${newStudent.studentID}</li>
    <li><strong>Username:</strong> ${newStudent.user_name}</li>
    <li><strong>Password:</strong> ${newStudent.password}</li>
  </ul>

  <p>🔐 Please keep this information secure and do not share it with others.</p>

  <p>⚠️ Since the password was shared online, we recommend changing it once you have fully explored the student panel to avoid any potential vulnerabilities.</p>

  <p><strong>Next Steps:</strong></p>
  <ul>
    <li>Log in to your student account</li>
    <li>Explore your dashboard and available resources</li>
    <li>Stay up to date with assigned marks, tasks and more.</li>
  </ul>

  <p>If you face any issues logging in or need support, feel free to contact the admin office.</p>

  <p>We wish you a successful and enriching academic journey!</p>
  <br>
  <p>Best regards,<br><strong>University Admin Team</strong></p>
  `
    )
  res.redirect('/admin/students');
});

// ----------------------------------------------------------
// Editing an existing student
// NOW TRANSFERRING THIS ROUTE TO STUDENTS AS A FEATURE TO UPDATE BY THEIR OWN
const methodOverride=require("method-override");
app.use(methodOverride("_method"));


// ---------------------------------------------------------------------------
// Deleting a student
app.delete('/admin/students/:id',(req,res)=>{
    const delID = req.params.id;
     // Find the student before deleting
    const studentToDelete = students.find(s => s.studentID === delID);

    // Delete the student
    students = students.filter(p => delID !== p.studentID);

    // Send email if student existed and had a valid Gmail
    if (studentToDelete && studentToDelete.gmail) {
        sendMail(
            studentToDelete.gmail,
            "Your Account Has Been Deleted",
            `
            <h2>⚠️ Account Deletion Notice</h2>
            <p>Dear ${studentToDelete.Full_name},</p>

            <p>We would like to inform you that your student account has been <strong>successfully deleted</strong> by the university administration.</p>

            <p>This means you will no longer have access to your dashboard or any student-related services.</p>

            <p>If you believe this was a mistake or have any questions, please contact the administration team as soon as possible.</p>

            <br>
            <p>Best regards,<br><strong>University Admin Team</strong></p>
            `
        );
    }
    res.redirect("/admin/students");
});

// ---------------------------------------------------------------------------
// Now managing teachers
app.get('/admin/teachers', (req, res) => {
    const { department, course} = req.query;

    const allCourses = new Set();
    const allDepartments = new Set();
    // It creates a new empty set, a set is like an array but it keeps unique values (no duplicate values allowed).

    // Collect all unique courses and departments
    teachers.forEach(t => {
        allDepartments.add(t.department);
        t.subjects_assigned.forEach(s => allCourses.add(s.course));
    });

    let filteredTeachers = teachers;

    // Filter by department
    if (department && department !== "All") {
        filteredTeachers = filteredTeachers.filter(t => t.department === department);
        // For each teacher t, only keep them if their department matches the selected department
    }

    // Filter by course
    if (course && course !== "All") {
        filteredTeachers = filteredTeachers.filter(t =>
            t.subjects_assigned.some(s => s.course === course)
        );
    }

    res.render("admin-teachers.ejs", {
        teachers: filteredTeachers,
        //  Always convert Set to array before sending to your view
        departments: Array.from(allDepartments),
        courses: Array.from(allCourses),
        selectedDepartment: department,
        selectedCourse: course
    });
});

// Sub routes to manage teachers i.e Adding a new teacher
    let nextTeacherNumber = Math.max(
  ...teachers.map(t => parseInt(t.teacherID.slice(1))),
  100 // Default fallback if no teachers yet
);
app.get('/admin/teachers/new',(req,res)=>{
    let nextTeacherID = `T${nextTeacherNumber + 1}`;

    // Pass nextTeacherID to the form
    res.render("teacher-new.ejs", { nextTeacherID });
});

app.post('/admin/teachers', (req, res) => {
    nextTeacherNumber++; // Increase counter
    const newTeacherID = `T${nextTeacherNumber}`;
    const {
        Full_name,
        username,
        password,
        gender,
        department,
        experience,
        dob,
        joining_date,
        status,
        gmail
    } = req.body;

    let subjects = [];

if (req.body.subjects_assigned) {
    // req.body.subjects_assigned will be an object like:
    // { '0': {name: '...', course: '...', semester: '...'}, ... }
    if (typeof req.body.subjects_assigned === 'object') {
        for (const key in req.body.subjects_assigned) {
            const entry = req.body.subjects_assigned[key];
            subjects.push({
                name: entry.name,
                course: entry.course,
                semester: entry.semester
            });
        }
    }
}

    const newTeacher = {
        Full_name,
        username,
        password,
        gender,
        teacherID: newTeacherID, 
        department,
        years_of_experience: Number(experience),
        dob,
        joining_date,
        status,
        subjects_assigned: subjects,
        gmail
    };

    teachers.push(newTeacher);

    sendMail(
        newTeacher.gmail,
        "🎉 Your Teacher Account Has Been Created",
        `
        <h2>Welcome to the University Portal!</h2>

        <p>Dear ${newTeacher.Full_name},</p>

        <p>We are excited to inform you that your <strong>teacher account</strong> has been successfully created on the University Management System.</p>

        <p>Here are your login details:</p>
        <ul>
            <li><strong>Username:</strong> ${newTeacher.username}</li>
            <li><strong>Teacher ID:</strong> ${newTeacher.teacherID}</li>
            <li><strong>Password:</strong> ${newTeacher.password}</li>
        </ul>

        <p>You can now log in and start accessing your dashboard to assign tasks to students, manage their records such as marks and more.</p>

        <p>⚠️ Since the password was shared online, we recommend changing it once you have fully explored the teacher panel to avoid any potential vulnerabilities.</p>

        <p>If you have any questions or need help, feel free to reach out to the administration team.</p>

        <br>
        <p>Best regards,<br><strong>University Admin Team</strong></p>
        `
    );

    res.redirect('/admin/teachers');
});


// Editing an existing teacher ** NOW REMOVING IT TO TEACHER SINCE TEACHER CAN DO IT'S OWN CHANGES

// -------------------------------------------------------------------------------------------------------------------------------------------
// Deleting a teacher
app.delete('/admin/teachers/:id',(req,res)=>{
    const delID = req.params.id;
    
    // Find the teacher to delete
    const teacherToDelete = teachers.find(p => p.teacherID === delID);

// Send email before deletion (if teacher exists)
    if (teacherToDelete) {
        sendMail(
            teacherToDelete.gmail,
            "⚠️ Your Teacher Account Has Been Deleted",
            `
            <h2>⚠️ Account Deletion Notice</h2>

            <p>Dear ${teacherToDelete.Full_name},</p>

            <p>We would like to inform you that your <strong>teacher account</strong> has been <strong>successfully deleted</strong> by the university administration.</p>

            <p>This means you will no longer have access to the university portal, your dashboard, or any teacher-related functionalities.</p>

            <p>If you believe this action was taken in error or you have any questions regarding the deletion, please contact the administration office immediately.</p>

            <br>
            <p>Best regards,<br><strong>University Admin Team</strong></p>
            `
        );
    }

    // Delete teacher
    teachers = teachers.filter(p => p.teacherID !== delID);

    // Redirect back
    res.redirect("/admin/teachers");
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------

// NOW MANAGING TEACHER 
app.get('/teacher/login',(req,res)=>{
    res.render('teacher-login.ejs');
});
// TEACHER LOGIN
app.post('/teacher/login', (req, res) => {
    const { username, password, teacherID } = req.body;
    let foundTeacher = teachers.find(t =>
        t.username === username &&
        t.password === password &&
        t.teacherID === teacherID
    );

    if (foundTeacher) {
        // Redirect to dashboard route
        res.redirect(`/teacher/dashboard/${foundTeacher.teacherID}`);
    } else {
        res.send("Invalid credentials. Access denied.");
    }
});
// TEACHER DASHBOARD
app.get('/teacher/dashboard/:id', (req, res) => {

    const { id } = req.params;
    const teacher = teachers.find(t => t.teacherID === id);
    if (!teacher) return res.send("Teacher not found");

    res.render("teacher-dash.ejs", {
        teacher_full_name: teacher.Full_name,
        subjects: teacher.subjects_assigned,
        teacherID: teacher.teacherID
    });
});
// FAKE LOGOUT WORK FOR EACH USER
app.get('/logout', (req, res) => {
  res.redirect('/'); 
});
// TEACHER UPDATE
app.get('/teacher/dashboard/edit/:id',(req,res)=>{
    const { id } = req.params;
    const teacher = teachers.find(t => t.teacherID === id);
    if (!teacher) return res.send("Teacher not found for editing");
    res.render("teacher-edit.ejs", { editTeacher: teacher });
});
app.patch('/teacher/dashboard/edit/:id',(req,res)=>{
    const id = req.params.id;
    const teacher = teachers.find(t => t.teacherID === id);
    if (teacher) {
        teacher.Full_name = req.body.Full_name || teacher.Full_name;
        teacher.username = req.body.username || teacher.username;
        teacher.password = req.body.password || teacher.password;
        teacher.department = req.body.department || teacher.department;
        teacher.years_of_experience = Number(req.body.experience) || teacher.years_of_experience;
        teacher.gender = req.body.gender || teacher.gender;
        teacher.dob = req.body.dob || teacher.dob;
        teacher.joining_date = req.body.joining_date || teacher.joining_date;
        teacher.status = req.body.status || teacher.status;
        teacher.gmail = req.body.gmail || teacher.gmail;

        if (req.body.subjects_assigned) {
        const subjectsArray = Object.values(req.body.subjects_assigned); // handles multiple subjects
        teacher.subjects_assigned = subjectsArray.map(s => ({
            name: s.name,
            course: s.course,
            semester: s.semester || "N/A"
        }));
}
    }

    sendMail(
        teacher.gmail,
        "✅ Your Teacher Profile Has Been Updated",
        `
        <h2>📢 Profile Update Notification</h2>
        <p>Dear ${teacher.Full_name},</p>
         <p>Your profile has been successfully updated with the latest information.</p>
        <p>However, we recommend reviewing your details once again by visiting your dashboard and clicking on "Edit Profile".</p>
        <p>If you notice any incorrect information, please update it accordingly.</p>
        <p>Thank you!</p>
        <p><strong>University Admin Team</strong></p>
        `
    );

    res.redirect(`/teacher/dashboard/${id}`);
});

// ✅ GET: Assigned students for a subject
app.get('/teacher/assigned-students/:teacherID/:subject', (req, res) => {
  const { teacherID, subject } = req.params;

  const teacher = teachers.find(t => t.teacherID === teacherID);
  if (!teacher) return res.send("❌ Teacher not found");

  const subjects = teacher.subjects_assigned.map(s => s.name);

  const assignedStudents = students.filter(student => {
    if (!student.subjects_with_assessments) return false;

    return student.subjects_with_assessments.some(s =>
      s.subject.trim().toLowerCase() === subject.trim().toLowerCase()
    );
  });

  res.render('assigned-students', {
    teacher,
    subjects,
    assignedStudents,
    selectedSubject: subject
  });
});
// ✅ POST: Update marks for students in a subject
app.post('/teacher/assigned-students/:teacherID/:subject/update', (req, res) => {
  const { teacherID, subject } = req.params;

  for (let key in req.body) {
    const [studentID, type] = key.split('_');
    const value = parseInt(req.body[key]);

    if (isNaN(value)) continue;

    const student = students.find(s => s.studentID === studentID);
    if (!student) continue;

    const subjectEntry = student.subjects_with_assessments.find(
      s => s.subject.trim().toLowerCase() === subject.trim().toLowerCase()
    );
    if (!subjectEntry) continue;

    const assessment = subjectEntry.assessments.find(a => a.type === type);
    if (assessment) {
      assessment.marks = value;
    //   console.log(`✅ Updated: ${student.Full_name} - ${type} => ${value}`);
    }
  }

  res.redirect(`/teacher/dashboard/${teacherID}/marks-saved`);
});
app.get("/teacher/dashboard/:teacherID/marks-saved",(req,res)=>{
    const {teacherID} = req.params;
    res.render('marks-saved.ejs',{teacherID});
});

let teacher_has_sub = [];
app.get("/teacher/send/materials/:teacherID", (req, res) => {
    const { teacherID } = req.params;

    const teacher = teachers.find(t => t.teacherID === teacherID);
    if (!teacher) return res.send("❌ Teacher not found");

    const subjects_assigned = teacher.subjects_assigned || [];

    let teacher_has_sub = [];
    for (let i = 0; i < subjects_assigned.length; i++) {
        teacher_has_sub.push(subjects_assigned[i].name);
    }

    res.render('send-material.ejs', { subjects: teacher_has_sub,teacherID });
});

// NOW HERE USING MULTER NPM FOR UPLOADING FILES
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage })
app.post("/teacher/send/materials/:teacherID", upload.single('material'),(req,res)=>{
    // res.json(req.file);
    const {subject} = req.body;
    // console.log(subject);
    const uploadedFile = req.file;

    let emails_of_stu = [];
    let emailSentCheck = 0;

    for (let i = 0; i < students.length; i++) 
    {
        const student = students[i];
        if(student.subjects_with_assessments && student.subjects_with_assessments.length > 0)
        {
            for (let j = 0; j < student.subjects_with_assessments.length; j++) {
                if(student.subjects_with_assessments[j].subject === subject)
                {
                    emails_of_stu.push(student.gmail);
                    // console.log("Subject found in students.");
                }
                break;
            }
            
        }

    }
    // console.log(emails_of_stu);

    const { teacherID } = req.params;
    const teacher = teachers.find(t => t.teacherID === teacherID);
    for (let index = 0; index < emails_of_stu.length; index++) 
    {
        sendFile(
            emails_of_stu[index],
            "📘 Study Material Shared by Your Professor",
            `
            <h2>📘 New Study Material Received</h2>
            <p>Dear Student,</p>
            <p>Your professor <strong>${teacher.Full_name}</strong> has shared new study resources related to your subject: <strong>${subject}</strong>.</p>
            <p>Please check the file attached with this mail to access the material.</p>
            <p>Stay focused and keep learning!</p>
            <p><strong>University Admin Team</strong></p>
            `,
            uploadedFile.path
        );
        emailSentCheck++;
    }
    if(emailSentCheck > 0)
    {
        res.render("file_sent_done.ejs",{emails_of_stu,teacherID});
    }
    else
    {
        res.send("Failed to send emails. Please try again.");
    }
});

app.get('/teacher/attendance/:teacherID',(req,res)=>{
    const teacherID = req.params.teacherID;

    const teacher = teachers.find(t => t.teacherID === teacherID);
    const assignedSubjects = teacher ? teacher.subjects_assigned.map(sub => sub.name) : [];

    res.render('teacher-attendance.ejs',{ teacher ,teacherID, assignedSubjects, students});
});
app.post('/teacher/attendance/save/:teacherID', (req, res) => {
  const { teacherID } = req.params;
  const subject = req.body.subject;
  const attendance = req.body.attendance;

  // Loop over each student in the submitted attendance form
    for (let studentID in req.body.attendance) {

  // Get the submitted counts for this student
  const counts = req.body.attendance[studentID];  // { present: "2", absent: "3", holiday: "1" }

  // Find the matching student from your student list
  let student = students.find(s => s.studentID === studentID);
  if (!student) continue;

  // Find the subject inside the student's data
  let subjectData = student.subjects_with_assessments.find(sub => sub.subject === req.body.subject);
  if (!subjectData) continue;

  // Update the attendance values (convert to number)
  subjectData.attendance.present = parseInt(counts.present);
  subjectData.attendance.absent = parseInt(counts.absent);
  subjectData.attendance.holiday = parseInt(counts.holiday);
}
 res.render('attendance-done.ejs',{teacherID});
});

app.get('/student/login',(req,res)=>{
    res.render("student-login.ejs");
});
app.post('/student/login', (req, res) => {
    const { username, password, studentID } = req.body;
    let foundStudent = students.find(t =>
        t.user_name === username &&
        t.password === password &&
        t.studentID === studentID
    );

    if (foundStudent) {
        // Redirect to dashboard route
        res.redirect(`/student/dashboard/${foundStudent.studentID}`);
    } else {
        res.send("Invalid credentials. Access denied.");
    }
});
app.get('/student/dashboard/:studentID',(req,res)=>{
    const studentID = req.params.studentID;
    const student = students.find(s => s.studentID === studentID);

    if (!student) return res.send("Student not found");

    res.render('student-dash.ejs', { student });
});

app.patch("/student/update/:studentID",(req,res)=>{
    let id_of_editVaalaData = req.params.studentID;
    const student = students.find(s => s.studentID == id_of_editVaalaData);
     if (!student) {
        return res.status(404).send("Student not found");
    }

    // Update fields if present in the request
    student.Full_name = req.body.Full_name || student.Full_name;
    student.user_name = req.body.user_name || student.user_name;
    student.password = req.body.password || student.password;
    student.course = req.body.course || student.course;
    student.Year = req.body.Year || student.Year;
    student.semester = req.body.semester || student.semester;
    student.gender = req.body.gender || student.gender;
    student.dob = req.body.dob || student.dob;
    student.gmail = req.body.gmail || student.gmail;
    sendMail(
    `${student.gmail}`,
    "Your Student Details Have Been Updated",
    `<h2>✅ Your Information Has Been Updated Successfully</h2>

    <p>Dear ${student.Full_name},</p>

    <p>Your profile information has been successfully updated.</p>

    <p>However, we recommend that you <strong>review your updated information</strong> on your student dashboard. If you notice any mismatch or incorrect details, please update the information again with the correct data.</p>

    <p><strong>Here are your current profile details:</strong></p>
    <ul>
        <li><strong>Full Name:</strong> ${student.Full_name}</li>
        <li><strong>Username:</strong> ${student.user_name}</li>
        <li><strong>Course:</strong> ${student.course}</li>
        <li><strong>Year:</strong> ${student.Year}</li>
        <li><strong>Semester:</strong> ${student.semester}</li>
        <li><strong>Gender:</strong> ${student.gender}</li>
        <li><strong>Date of Birth:</strong> ${student.dob}</li>
        <li><strong>Email:</strong> ${student.gmail}</li>
    </ul>

    <p>⚠️ <strong>Note:</strong> If you have changed your password, it is not shared in this email for security reasons. You can use your new password to log in.</p>

    <p>If any details seem incorrect, please update your profile again at the earliest.</p>

    <br>
    <p>Best regards,<br><strong>University Admin Team</strong></p>`
);
 res.redirect(`/student/dashboard/${req.params.studentID}`);
});