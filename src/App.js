import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MarksChart from "./MarksChart"; // Import the chart component

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [tempUser, setTempUser] = useState(null);
  const [isEdit, setIsEdit] = useState(true);

  // Helper function to calculate total marks
  const calculateTotalMarks = (marks) => {
    return Object.values(marks).reduce((sum, mark) => sum + mark, 0);
  };

  // Function to login
  const login = async () => {
    const res = await axios.post(
      "https://student-server.collegestorehub.com/login",
      {
        username,
        password,
      }
    );
    if (res.data === "Unauthorized") {
      alert("Unauthorized");
    } else {
      setLoggedInUser(res.data);
      alert("Logged in successfully");
    }
  };

  // Fetch students from the API
  const fetchStudents = async () => {
    const res = await axios.get(
      "https://student-server.collegestorehub.com/students"
    );
    setStudents(res.data);
  };

  // Function to update student marks
  const updateStudentMarks = async () => {
    if (tempUser.name === "" || tempUser.password === "") {
      alert("Please enter name and password");
      return;
    }
    if (Object.values(tempUser.marks).some((mark) => mark < 0 || mark > 100)) {
      alert("Marks should be between 0 and 100");
      return;
    }
    const totalMarks = calculateTotalMarks(tempUser.marks);
    const updatedStudent = { ...tempUser, totalMarks };

    const res = await axios.put(
      `https://student-server.collegestorehub.com/students/${tempUser.id}`,
      { student: updatedStudent, username: loggedInUser.name }
    );
    if (res.status === 200) {
      alert("Marks updated successfully");
      fetchStudents();
    }
  };

  // Function to add a new student
  const addStudent = async () => {
    if (tempUser.name === "" || tempUser.password === "") {
      alert("Please enter name and password");
      return;
    }
    if (Object.values(tempUser.marks).some((mark) => mark < 0 || mark > 100)) {
      alert("Marks should be between 0 and 100");
      return;
    }
    const totalMarks = calculateTotalMarks(tempUser.marks);
    const newStudent = { ...tempUser, totalMarks };

    const res = await axios.post(
      "https://student-server.collegestorehub.com/students/add",
      {
        student: newStudent,
        username: loggedInUser.name,
      }
    );
    if (res.status === 200) {
      alert("Student added successfully");
      fetchStudents();
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchStudents();
    }
  }, [loggedInUser]);
  return (
    <div className="App">
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">Home</a>
          <div className="d-flex align-items-center">
            {loggedInUser ? (
              <>
                <div className="me-3">Welcome {loggedInUser.name}</div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setLoggedInUser("")}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login form */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Login
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={login}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {loggedInUser ? (
        <>
          <div className="d-flex flex-row mt-3">
            {/* Top 5 students table */}
            <div className="container mt-3">
              <h1>Top 5 Students</h1>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    ?.sort((a, b) => b.totalMarks - a.totalMarks)
                    .slice(0, 5)
                    .map((student) => (
                      <tr key={student.name}>
                        <td>{student.name}</td>
                        <td>{student.totalMarks}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Topper of each subject */}
            <div className="container mt-3">
              <h1>Topper of Each Subject</h1>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Topper</th>
                    <th scope="col">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students[0]?.marks &&
                    Object.keys(students[0].marks).map((subject) => {
                      const topper = students.sort(
                        (a, b) => b.marks[subject] - a.marks[subject]
                      )[0];
                      return (
                        <tr key={subject}>
                          <td>{subject}</td>
                          <td>{topper.name}</td>
                          <td>{topper.marks[subject]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* All students table */}
          <div className="container mt-3">
            <div className="d-flex flex-row justify-content-between">
              <h1>Students</h1>
              {!loggedInUser.student && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsEdit(false);
                    setTempUser({
                      name: "",
                      password: "",
                      marks: {
                        English: 0,
                        Math: 0,
                        Hindi: 0,
                        Science: 0,
                        SocialScience: 0,
                      },
                    });
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#MarksModel"
                >
                  Add Student
                </button>
              )}
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">English</th>
                  <th scope="col">Math</th>
                  <th scope="col">Hindi</th>
                  <th scope="col">Science</th>
                  <th scope="col">Social Science</th>
                  <th scope="col">Total Marks</th>
                  <th scope="col">Percentile</th>
                  {!loggedInUser?.student && <th scope="col">Edit Marks</th>}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.name}
                    className={
                      loggedInUser.student && loggedInUser.name === student.name
                        ? "table-active"
                        : ""
                    }
                  >
                    <td>{student.name}</td>
                    <td>{student.marks.English}</td>
                    <td>{student.marks.Math}</td>
                    <td>{student.marks.Hindi}</td>
                    <td>{student.marks.Science}</td>
                    <td>{student.marks.SocialScience}</td>
                    <td>{student.totalMarks}/500</td>
                    <td>{((student.totalMarks / 500) * 100).toFixed(2)}%</td>
                    {!loggedInUser.student && (
                      <td
                        data-bs-toggle="modal"
                        data-bs-target="#MarksModel"
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          setIsEdit(true);
                          setTempUser(student);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MarksChart students={students} />
          {/* Edit Marks Modal */}
          <div
            className="modal fade"
            id="MarksModel"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {isEdit ? "Edit" : "Add"} Student Details
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="studentName" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        id="studentName"
                        value={tempUser?.name}
                        onChange={(e) =>
                          setTempUser({ ...tempUser, name: e.target.value })
                        }
                      />
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        className="form-control"
                        id="password"
                        value={tempUser?.password}
                        onChange={(e) =>
                          setTempUser({ ...tempUser, password: e.target.value })
                        }
                      />
                      <p className="mt-3">
                        <b>Edit Subject Marks</b>
                      </p>
                      {Object.keys(tempUser?.marks || {}).map((subject) => (
                        <div key={subject}>
                          {loggedInUser.subject
                            ? loggedInUser.subject !== subject
                            : true}
                          <label
                            htmlFor={`${subject}Marks`}
                            className="form-label"
                          >
                            {subject} Marks
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            disabled={
                              loggedInUser.subject
                                ? loggedInUser.subject !== subject
                                  ? true
                                  : false
                                : false
                            }
                            min="0"
                            max="100"
                            value={tempUser?.marks[subject]}
                            id={`${subject}Marks`}
                            onChange={(e) => {
                              console.log(e.target.value);
                              setTempUser({
                                ...tempUser,
                                marks: {
                                  ...tempUser.marks,
                                  [subject]: parseInt(e.target.value),
                                },
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={isEdit ? updateStudentMarks : addStudent}
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-center">Log In to view Student Details</h1>
      )}
    </div>
  );
}

export default App;
