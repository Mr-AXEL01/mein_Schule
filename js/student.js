class Student {
    constructor(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.courses = [];
    }
}

class StudentManager {
    constructor() {
        this.students = this.loadStudents();
        this.courses = this.loadCourses();
        this.studentId = this.getQueryParam('id');
        this.student = null;

        this.init();

        if (document.getElementById('studentForm')) {
            document.getElementById('studentForm').addEventListener('submit', this.handleStudentSubmit.bind(this));
            this.loadStudentTable();
        }

        if (document.getElementById('courseForm')) {
            document.getElementById('courseForm').addEventListener('submit', this.handleCourseSubmit.bind(this));
        }
    }

    init() {
        if (this.studentId) {
            this.student = this.students.find(student => student.id == this.studentId);
            if (this.student) {
                this.loadStudentDetails();
                this.loadAvailableCourses();
                this.loadStudentCourses();
            }
        }
    }

    handleStudentSubmit(event) {
        event.preventDefault();
    
        const name = document.getElementById('studentName').value.trim();
        const age = document.getElementById('studentAge').value.trim();
    
        let isValid = true;
    
        if (!name) {
            this.showError('errorStudentName', 'Name is required');
            isValid = false;
        } else {
            this.showError('errorStudentName', '');
        }
    
        if (!age) {
            this.showError('errorStudentAge', 'Age is required');
            isValid = false;
        } else if (isNaN(age) || age <= 0) {
            this.showError('errorStudentAge', 'Age must be a positive number');
            isValid = false;
        } else {
            this.showError('errorStudentAge', '');
        }
    
        if (isValid) {
            if (this.studentId) {
                const existingStudent = this.students.find(student => student.id == this.studentId);
                if (existingStudent) {
                    existingStudent.name = name;
                    existingStudent.age = age;
                }
            } else {
                const id = this.generateUniqueId();
                const newStudent = new Student(id, name, age);
                this.students.push(newStudent);
            }
    
            this.saveStudents();
            this.loadStudentTable();
            this.clearStudentForm();
            this.studentId = null;
        }
    }    

    generateUniqueId() {
        return this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    }

    showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    loadStudentTable() {
        const studentTable = document.getElementById('studentTable');
        if (studentTable) {
            studentTable.innerHTML = '';
            this.students.forEach(student => {
                const row = document.createElement('tr');
                row.style.cursor = 'pointer';
                row.innerHTML = `
                    <td class="clickable border px-4 py-2">${student.id}</td>
                    <td class="clickable border px-4 py-2">${student.name}</td>
                    <td class="clickable border px-4 py-2">${student.age}</td>
                    <td class="flex justify-center gap-4 px-6 py-2">
                        <span class="icon-button icon-update" onclick="studentManager.editStudent(${student.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </span>
                        <span class="icon-button icon-delete" onclick="studentManager.deleteStudent(${student.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </span>
                    </td>
                `;
                row.querySelectorAll('.clickable').forEach(cell => {
                    cell.addEventListener('click', () => {
                        window.location.href = `studentDetails.html?id=${student.id}`;
                    });
                });
                studentTable.appendChild(row);
            });
        }
    }

    clearStudentForm() {
        document.getElementById('studentName').value = '';
        document.getElementById('studentAge').value = '';
    }

    editStudent(id) {
        const student = this.students.find(student => student.id === id);
        if (student) {
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
            this.studentId = id;
        }
    }    

    deleteStudent(id) {
        this.students = this.students.filter(student => student.id !== id);
        this.saveStudents();
        this.loadStudentTable();
    }

    loadStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    loadStudentDetails() {
        const student = this.students.find(student => student.id == this.studentId);
        if (student) {
            document.getElementById('studentId').textContent = student.id;
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentAge').textContent = student.age;
        }
    }

    loadCourses() {
        return JSON.parse(localStorage.getItem('courses')) || [];
    }

    loadAvailableCourses() {
        const availableCoursesSelect = document.getElementById('courseName');
        if (availableCoursesSelect && this.student) {
            availableCoursesSelect.innerHTML = '';
            
            this.courses.forEach(course => {
                const courseId = String(course.id);
                const studentCourseIds = this.student.courses.map(String);
                
                // console.log('Checking course:', courseId);
                if (!studentCourseIds.includes(courseId)) {
                    const option = document.createElement('option');
                    option.value = courseId;
                    option.textContent = course.name;
                    availableCoursesSelect.appendChild(option);
                    // console.log('Adding course to select:', course);
                }
            });
        }
    }    

    handleCourseSubmit(event) {
        event.preventDefault();
        const courseId = document.getElementById('courseName').value;
        if (courseId && this.studentId) {
            const student = this.students.find(student => student.id == this.studentId);
            if (student && !student.courses.includes(courseId)) {
                student.courses.push(courseId);
                this.saveStudents();
                this.loadStudentCourses();
                this.loadAvailableCourses();
            }
        }
    }

    loadStudentCourses() {
        const studentCoursesList = document.getElementById('courseTable');
        if (studentCoursesList) {
            studentCoursesList.innerHTML = '';
            const student = this.students.find(student => student.id == this.studentId);
            if (student) {
                student.courses.forEach(courseId => {
                    const course = this.courses.find(course => course.id == courseId);
                    if (course) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="border px-4 py-2">${course.id}</td>
                            <td class="border px-4 py-2">${course.name}</td>
                            <td class="border px-4 py-2">
                                <button class="px-4 py-1 bg-red-600 text-white rounded-lg" onclick="studentManager.removeCourse(${student.id}, '${course.id}')">Remove</button>
                            </td>
                        `;
                        studentCoursesList.appendChild(row);
                    }
                });
            }
        }
    }

    removeCourse(studentId, courseId) {
        const student = this.students.find(student => student.id == studentId);
        if (student) {
            student.courses = student.courses.filter(c => c !== courseId);
            this.saveStudents();
            this.loadStudentCourses();
            this.loadAvailableCourses();
        }
    }
}

const studentManager = new StudentManager();
