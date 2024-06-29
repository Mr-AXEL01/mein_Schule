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
        if (document.getElementById('studentId') && this.studentId) {
            this.loadStudentDetails();
            this.loadAvailableCourses();
            this.loadStudentCourses();
        }
    }

    handleStudentSubmit(event) {
        event.preventDefault();

        const id = document.getElementById('studentId').value.trim();
        const name = document.getElementById('studentName').value.trim();
        const age = document.getElementById('studentAge').value.trim();

        let isValid = true;

        if (!id) {
            this.showError('errorStudentId', 'ID is required');
            isValid = false;
        } else {
            this.showError('errorStudentId', '');
        }

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
            const existingStudentIndex = this.students.findIndex(student => student.id == id);
            if (existingStudentIndex >= 0) {
                this.students[existingStudentIndex].name = name;
                this.students[existingStudentIndex].age = age;
            } else {
                const newStudent = new Student(id, name, age);
                this.students.push(newStudent);
            }

            this.saveStudents();
            this.loadStudentTable();
            this.clearStudentForm();
        }
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
                    <td class="clickAble border px-4 py-2">${student.id}</td>
                    <td class="clickAble border px-4 py-2">${student.name}</td>
                    <td class="clickAble border px-4 py-2">${student.age}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="studentManager.editStudent(${student.id})">Edit</button>
                        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="studentManager.deleteStudent(${student.id})">Delete</button>
                    </td>
                `;
                studentTable.appendChild(row);
    
                const clickableCells = row.querySelectorAll('.clickAble');
                clickableCells.forEach(cell => {
                    cell.addEventListener('click', () => this.goToStudentDetails(student.id));
                });
            });
        }
    } 

    editStudent(id) {
        const student = this.students.find(s => s.id == id);
        if (student) {
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
        }
    }

    deleteStudent(id) {
        this.students = this.students.filter(student => student.id != id);
        this.saveStudents();
        this.loadStudentTable();
    }

    clearStudentForm() {
        document.getElementById('studentId').value = '';
        document.getElementById('studentName').value = '';
        document.getElementById('studentAge').value = '';
    }

    goToStudentDetails(studentId) {
        window.location.href = `studentDetails.html?id=${studentId}`;
    }

    loadStudentDetails() {
        const student = this.students.find(s => s.id == this.studentId);
        if (student) {
            document.getElementById('studentId').textContent = student.id;
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentAge').textContent = student.age;
        }
    }

    loadAvailableCourses() {
        const student = this.students.find(s => s.id == this.studentId);
        const studentCourses = student ? student.courses : [];
        const availableCourses = this.courses.filter(course => !studentCourses.includes(course.id));
        const courseSelect = document.getElementById('courseName');
        courseSelect.innerHTML = '';

        availableCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    }

    loadStudentCourses() {
        const student = this.students.find(s => s.id == this.studentId);
        const studentCourses = student ? student.courses : [];
        const courseTable = document.getElementById('courseTable');
        courseTable.innerHTML = '';

        studentCourses.forEach(courseId => {
            const course = this.courses.find(c => c.id == courseId);
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="border px-4 py-2">${course.id}</td>
                <td class="border px-4 py-2">${course.name}</td>
                <td class="border px-4 py-2">
                    <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="studentManager.removeCourse(${course.id})">Remove</button>
                </td>
            `;
            courseTable.appendChild(row);
        });
    }


    handleCourseSubmit(event) {
        event.preventDefault();
        const courseId = document.getElementById('courseName').value;
    
        if (!courseId) {
            this.showError('errorCourseName', 'Please select a course');
        } else {
            this.showError('errorCourseName', '');
    
            const student = this.students.find(s => s.id == this.studentId);
            if (student && !student.courses.includes(courseId)) {
                student.courses.push(courseId);
                this.saveStudents();
                this.loadStudentCourses();
                this.loadAvailableCourses();
            }
        }
    }

    removeCourse(courseId) {
        const student = this.students.find(s => s.id == this.studentId);
        if (student) {
            student.courses = student.courses.filter(id => id != courseId);
            this.saveStudents();
            this.loadStudentCourses();
            this.loadAvailableCourses();
        }
    }

    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    loadStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    loadCourses() {
        return JSON.parse(localStorage.getItem('courses')) || [];
    }
}

const studentManager = new StudentManager();
