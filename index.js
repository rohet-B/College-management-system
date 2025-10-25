// ------------------------------ IMPORTS ------------------------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// ------------------------------ CONNECT MONGODB (Vercel-friendly) ------------------------------
let isConnected = false; // To avoid multiple connections on serverless deploys

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000, // 10 sec
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB Atlas connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

// Immediately try to connect once on startup
connectDB();

// ------------------------------ APP CONFIG ------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ------------------------------ NODEMAILER ------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendMail(to, sub, msg) {
  transporter.sendMail({ to, subject: sub, html: msg }, (err) => {
    if (err) console.error("Email send error:", err.message);
  });
}

function sendFile(to, sub, msg, filePath) {
  transporter.sendMail(
    {
      to,
      subject: sub,
      html: msg,
      attachments: [{ filename: path.basename(filePath), path: filePath }],
    },
    (err) => {
      if (err) console.error("File email send error:", err.message);
    }
  );
}

// ------------------------------ MONGOOSE MODELS ------------------------------
const assessmentSchema = new mongoose.Schema({
  type: String,
  marks: Number,
});
const subjectSchema = new mongoose.Schema({
  subject: String,
  assessments: [assessmentSchema],
  attendance: { present: Number, absent: Number, holiday: Number },
});
const studentSchema = new mongoose.Schema({
  Full_name: String,
  user_name: String,
  password: String,
  course: String,
  Year: String,
  semester: String,
  studentID: String,
  gender: String,
  dob: String,
  gmail: String,
  subjects_with_assessments: [subjectSchema],
});
const teacherSchema = new mongoose.Schema({
  Full_name: String,
  username: String,
  password: String,
  teacherID: String,
  department: String,
  years_of_experience: Number,
  joining_date: String,
  dob: String,
  gender: String,
  status: String,
  gmail: String,
  subjects_assigned: [
    { name: String, course: String, semester: String, year: String },
  ],
});
const adminSchema = new mongoose.Schema({
  First_name: String,
  Last_name: String,
  username_with_num: String,
  password: String,
});

const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Admin = mongoose.model("Admin", adminSchema);

// ------------------------------ ADMIN ROUTES ------------------------------
app.get("", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));
app.get("/admin/login", (req, res) => res.render("admin-login.ejs"));

app.post("/administrator/login", async (req, res) => {
  await connectDB();
  const { password, username_with_num } = req.body;
  const admin = await Admin.findOne({ username_with_num, password });
  if (admin) {
    const total_stu = await Student.countDocuments();
    const total_teacher = await Teacher.countDocuments();
    res.render("admin-dash.ejs", {
      admin_first_name: admin.First_name,
      admin_last_name: admin.Last_name,
      total_stu,
      total_teacher,
    });
  } else {
    res.send("Invalid credentials. Access denied.");
  }
});

app.get("/administrator/create", (req, res) => res.render("admin-create.ejs"));

app.post("/administrator/create", async (req, res) => {
  await connectDB();
  const { First_name, Last_name, password, special_key, username_with_num } = req.body;
  if (special_key === process.env.ADMIN_SECRET_KEY) {
    const newAdmin = new Admin({ First_name, Last_name, password, username_with_num });
    await newAdmin.save();
    res.redirect("/admin/login");
  } else {
    res.send("Invalid Key. Creation denied.");
  }
});

// ------------------------------ STUDENT MANAGEMENT ------------------------------

// Show students list
app.get("/admin/students", async (req, res) => {
  const { course, semester } = req.query;
  let students = await Student.find();

  if (course && course !== "All") students = students.filter(s => s.course === course);
  if (semester && semester !== "All") students = students.filter(s => s.semester === semester);

  const courseList = [...new Set(students.map(s => s.course))];
  const semesterList = [...new Set(students.map(s => s.semester))];

  res.render("admin-students.ejs", {
    students,
    courses: courseList,
    semesters: semesterList,
    selectedCourse: course || "All",
    selectedSemester: semester || "All",
  });
});

// New Student form
app.get("/admin/students/new", async (req, res) => {
  const last = await Student.findOne().sort({ studentID: -1 });
  const nextID = `S${(last ? parseInt(last.studentID.slice(1)) : 100) + 1}`;
  res.render("student-new.ejs", { nextID });
});

// Add Student
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
  { type: "External Exam", marks: 0 },
];
app.post("/admin/students", async (req, res) => {
  const last = await Student.findOne().sort({ studentID: -1 });
  const nextID = `S${(last ? parseInt(last.studentID.slice(1)) : 100) + 1}`;
  const rawSubjects = req.body.subjects || [];
  const subjects_with_assessments = rawSubjects.map(subject => ({
    subject: subject.subject,
    assessments: defaultAssessments.map(a => ({ ...a })),
    attendance: {
      present: parseInt(subject.attendance?.present || 0),
      absent: parseInt(subject.attendance?.absent || 0),
      holiday: parseInt(subject.attendance?.holiday || 0),
    },
  }));

  const newStudent = new Student({
    studentID: nextID,
    Full_name: req.body.Full_name,
    gender: req.body.gender,
    dob: req.body.dob,
    user_name: req.body.user_name,
    password: req.body.password,
    Year: req.body.Year,
    semester: req.body.semester,
    gmail: req.body.gmail.toLowerCase(),
    course: req.body.course.toUpperCase(),
    subjects_with_assessments,
  });
  await newStudent.save();
  sendMail(
    newStudent.gmail,
    "Welcome to the University!",
    `<h2>🎉 Welcome ${newStudent.Full_name}!</h2>
     <p>Your student account has been created. Use ID ${newStudent.studentID} and username ${newStudent.user_name}.</p>`
  );
  res.redirect("/admin/students");
});

// Delete Student
app.delete("/admin/students/:id", async (req, res) => {
  const { id } = req.params;
  const student = await Student.findOne({ studentID: id });
  if (student) {
    await Student.deleteOne({ studentID: id });
    sendMail(
      student.gmail,
      "Account Deleted",
      `<h2>Dear ${student.Full_name},</h2><p>Your student account has been deleted.</p>`
    );
  }
  res.redirect("/admin/students");
});
// ------------------------------ PART 3 & 4: TEACHER + STUDENT ROUTES ------------------------------

// ---------- TEACHER MANAGEMENT ----------

// Show teachers list (with filters)
app.get('/admin/teachers', async (req, res) => {
  const { department, course } = req.query;

  let teachers = await Teacher.find();
  // collect unique departments & courses
  const allDepartments = [...new Set(teachers.map(t => t.department))];
  const allCourses = new Set();
  teachers.forEach(t => t.subjects_assigned.forEach(s => allCourses.add(s.course)));

  if (department && department !== "All") {
    teachers = teachers.filter(t => t.department === department);
  }
  if (course && course !== "All") {
    teachers = teachers.filter(t => t.subjects_assigned.some(s => s.course === course));
  }

  res.render('admin-teachers.ejs', {
    teachers,
    departments: allDepartments,
    courses: Array.from(allCourses),
    selectedDepartment: department,
    selectedCourse: course
  });
});

// Show new teacher form with next ID
app.get('/admin/teachers/new', async (req, res) => {
  const allTeachers = await Teacher.find();
  const maxNum = allTeachers.length
    ? Math.max(...allTeachers.map(t => parseInt((t.teacherID || 'T100').slice(1)) || 100))
    : 100;
  const nextTeacherID = `T${maxNum + 1}`;
  res.render('teacher-new.ejs', { nextTeacherID });
});

// Add new teacher
app.post('/admin/teachers', async (req, res) => {
  try {
    // compute next ID
    const allTeachers = await Teacher.find();
    const maxNum = allTeachers.length
      ? Math.max(...allTeachers.map(t => parseInt((t.teacherID || 'T100').slice(1)) || 100))
      : 100;
    const newTeacherID = `T${maxNum + 1}`;

    // parse subjects_assigned from form if provided
    let subjects = [];
    if (req.body.subjects_assigned) {
      // If it comes as an object of entries or single entry
      if (typeof req.body.subjects_assigned === 'object') {
        const entries = Object.values(req.body.subjects_assigned);
        subjects = entries.map(e => ({ name: e.name, course: e.course, semester: e.semester }));
      } else {
        // single subject case (string) - not typical but just in case
        subjects = [{ name: req.body.subjects_assigned.name || '', course: req.body.subjects_assigned.course || '', semester: req.body.subjects_assigned.semester || '' }];
      }
    }

    const newTeacher = new Teacher({
      Full_name: req.body.Full_name,
      username: req.body.username,
      password: req.body.password,
      teacherID: newTeacherID,
      department: req.body.department,
      years_of_experience: Number(req.body.experience) || 0,
      joining_date: req.body.joining_date,
      dob: req.body.dob,
      gender: req.body.gender,
      status: req.body.status,
      gmail: req.body.gmail,
      subjects_assigned: subjects
    });

    await newTeacher.save();

    sendMail(newTeacher.gmail, '🎉 Your Teacher Account Has Been Created', `
      <h2>Welcome ${newTeacher.Full_name}</h2>
      <p>Your teacher account is ready. ID: ${newTeacher.teacherID}</p>
    `);

    res.redirect('/admin/teachers');
  } catch (err) {
    console.error('Error creating teacher:', err);
    res.send('Error creating teacher.');
  }
});

// Delete teacher
app.delete('/admin/teachers/:id', async (req, res) => {
  const delID = req.params.id;
  const teacher = await Teacher.findOne({ teacherID: delID });
  if (teacher) {
    await Teacher.deleteOne({ teacherID: delID });
    sendMail(
      teacher.gmail,
      "⚠️ Your Teacher Account Has Been Deleted",
      `<h2>Account Deleted</h2><p>Dear ${teacher.Full_name}, your teacher account has been deleted.</p>`
    );
  }
  res.redirect('/admin/teachers');
});

// ---------- TEACHER LOGIN & DASHBOARD ----------

app.get('/teacher/login', (req, res) => {
  res.render('teacher-login.ejs');
});

app.post('/teacher/login', async (req, res) => {
  const { username, password, teacherID } = req.body;
  const teacher = await Teacher.findOne({ username, password, teacherID });
  if (teacher) {
    res.redirect(`/teacher/dashboard/${teacher.teacherID}`);
  } else {
    res.send('Invalid credentials. Access denied.');
  }
});

app.get('/teacher/dashboard/:id', async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findOne({ teacherID: id });
  if (!teacher) return res.send('Teacher not found');
  res.render('teacher-dash.ejs', {
    teacher_full_name: teacher.Full_name,
    subjects: teacher.subjects_assigned,
    teacherID: teacher.teacherID
  });
});

// Fake logout
app.get('/logout', (req, res) => {
  res.redirect('/');
});

// Teacher edit GET
app.get('/teacher/dashboard/edit/:id', async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findOne({ teacherID: id });
  if (!teacher) return res.send('Teacher not found for editing');
  res.render('teacher-edit.ejs', { editTeacher: teacher });
});

// Teacher edit PATCH
app.patch('/teacher/dashboard/edit/:id', async (req, res) => {
  const id = req.params.id;
  const teacher = await Teacher.findOne({ teacherID: id });
  if (!teacher) return res.send('Teacher not found');

  // Update primitive fields
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

  // Update subjects_assigned if provided
  if (req.body.subjects_assigned) {
    const arr = Object.values(req.body.subjects_assigned);
    teacher.subjects_assigned = arr.map(s => ({ name: s.name, course: s.course, semester: s.semester || "N/A" }));
  }

  await teacher.save();

  sendMail(
    teacher.gmail,
    "✅ Your Teacher Profile Has Been Updated",
    `<h2>Profile Updated</h2><p>Dear ${teacher.Full_name}, your profile has been updated.</p>`
  );

  res.redirect(`/teacher/dashboard/${id}`);
});

// ---------- ASSIGNED STUDENTS & UPDATING MARKS ----------

// Get assigned students for a subject
app.get('/teacher/assigned-students/:teacherID/:subject', async (req, res) => {
  const { teacherID, subject } = req.params;
  const teacher = await Teacher.findOne({ teacherID });
  if (!teacher) return res.send('❌ Teacher not found');

  // Get all students who have this subject
  const assignedStudents = await Student.find({ 'subjects_with_assessments.subject': { $regex: new RegExp('^' + subject + '$', 'i') } });

  const subjects = teacher.subjects_assigned.map(s => s.name);

  res.render('assigned-students.ejs', {
    teacher,
    subjects,
    assignedStudents,
    selectedSubject: subject
  });
});

// POST update marks for students in a subject
app.post('/teacher/assigned-students/:teacherID/:subject/update', async (req, res) => {
  const { teacherID, subject } = req.params;

  // Each key in req.body looks like "{studentID}_{assessmentType}"
  for (let key in req.body) {
    const [studentID, ...typeParts] = key.split('_');
    const type = typeParts.join('_');
    const value = parseInt(req.body[key]);
    if (isNaN(value)) continue;

    const student = await Student.findOne({ studentID });
    if (!student) continue;

    const subj = student.subjects_with_assessments.find(s => s.subject.trim().toLowerCase() === subject.trim().toLowerCase());
    if (!subj) continue;

    const assessment = subj.assessments.find(a => a.type === type);
    if (assessment) {
      assessment.marks = value;
      await student.save();
    }
  }

  res.redirect(`/teacher/dashboard/${teacherID}/marks-saved`);
});

app.get('/teacher/dashboard/:teacherID/marks-saved', (req, res) => {
  const { teacherID } = req.params;
  res.render('marks-saved.ejs', { teacherID });
});

// ---------- SEND MATERIALS (Serverless-friendly) ----------

// On serverless platforms (like Vercel), we cannot reliably save files to disk.
// So, we use memoryStorage to store the uploaded file in memory and send it directly via email.
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/teacher/send/materials/:teacherID', async (req, res) => {
  const { teacherID } = req.params;
  const teacher = await Teacher.findOne({ teacherID });
  if (!teacher) return res.send('Teacher not found');

  const subjects_assigned = teacher.subjects_assigned || [];
  const teacher_has_sub = subjects_assigned.map(s => s.name);

  res.render('send-material.ejs', { subjects: teacher_has_sub, teacherID });
});

app.post('/teacher/send/materials/:teacherID', upload.single('material'), async (req, res) => {
  const { subject } = req.body;
  const uploadedFile = req.file; // file is in memory
  const { teacherID } = req.params;
  const teacher = await Teacher.findOne({ teacherID });
  if (!teacher) return res.send('❌ Teacher not found');

  // Find students who have that subject
  const studentsWithSubject = await Student.find({ 'subjects_with_assessments.subject': subject });

  let emails_of_stu = studentsWithSubject.map(s => s.gmail);
  let emailSentCheck = 0;

  for (let email of emails_of_stu) {
    transporter.sendMail({
      to: email,
      subject: "📘 Study Material Shared by Your Professor",
      html: `<h2>📘 New Study Material</h2>
             <p>Your professor <strong>${teacher.Full_name}</strong> has shared material for <strong>${subject}</strong>.</p>`,
      attachments: [
        {
          filename: uploadedFile.originalname,
          content: uploadedFile.buffer // send from memory
        }
      ]
    }, (err) => {
      if (err) console.error("Email send error:", err.message);
    });

    emailSentCheck++;
  }

  if (emailSentCheck > 0) {
    res.render('file_sent_done.ejs', { emails_of_stu, teacherID });
  } else {
    res.send('Failed to send emails. Please try again.');
  }
});

// ---------- ATTENDANCE ----------

app.get('/teacher/attendance/:teacherID', async (req, res) => {
  const teacherID = req.params.teacherID;
  const teacher = await Teacher.findOne({ teacherID });
  const assignedSubjects = teacher ? teacher.subjects_assigned.map(sub => sub.name) : [];
  const students = await Student.find();
  res.render('teacher-attendance.ejs', { teacher, teacherID, assignedSubjects, students });
});

app.post('/teacher/attendance/save/:teacherID', async (req, res) => {
  // structure expected: req.body.attendance[studentID] = { present: "...", absent: "...", holiday: "..." }
  for (let studentID in req.body.attendance) {
    const counts = req.body.attendance[studentID];
    const student = await Student.findOne({ studentID });
    if (!student) continue;

    const subjectName = req.body.subject;
    const subjectData = student.subjects_with_assessments.find(sub => sub.subject === subjectName);
    if (!subjectData) continue;

    subjectData.attendance.present = parseInt(counts.present) || 0;
    subjectData.attendance.absent = parseInt(counts.absent) || 0;
    subjectData.attendance.holiday = parseInt(counts.holiday) || 0;

    await student.save();
  }

  res.render('attendance-done.ejs', { teacherID: req.params.teacherID });
});

// ---------- STUDENT LOGIN, DASHBOARD & UPDATE ----------

app.get('/student/login', (req, res) => {
  res.render('student-login.ejs');
});

app.post('/student/login', async (req, res) => {
  const { username, password, studentID } = req.body;
  const student = await Student.findOne({ user_name: username, password, studentID });
  if (student) {
    res.redirect(`/student/dashboard/${student.studentID}`);
  } else {
    res.send('Invalid credentials. Access denied.');
  }
});

app.get('/student/dashboard/:studentID', async (req, res) => {
  const studentID = req.params.studentID;
  const student = await Student.findOne({ studentID });
  if (!student) return res.send('Student not found');
  res.render('student-dash.ejs', { student });
});

app.patch('/student/update/:studentID', async (req, res) => {
  const studentID = req.params.studentID;
  const student = await Student.findOne({ studentID });
  if (!student) return res.status(404).send('Student not found');

  // Update fields if present
  student.Full_name = req.body.Full_name || student.Full_name;
  student.user_name = req.body.user_name || student.user_name;
  student.password = req.body.password || student.password;
  student.course = req.body.course || student.course;
  student.Year = req.body.Year || student.Year;
  student.semester = req.body.semester || student.semester;
  student.gender = req.body.gender || student.gender;
  student.dob = req.body.dob || student.dob;
  student.gmail = req.body.gmail || student.gmail;

  await student.save();

  sendMail(
    student.gmail,
    "Your Student Details Have Been Updated",
    `<h2>✅ Profile Updated</h2><p>Dear ${student.Full_name}, your profile was updated successfully.</p>`
  );

  res.redirect(`/student/dashboard/${studentID}`);
});

// ------------------------------ START SERVER ------------------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});