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

        const id = document.getElementById('studentId').value;
        const name = document.getElementById('studentName').value;
        const age = document.getElementById('studentAge').value;

        if (id && name && age) {
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

    // loadStudentTable() {
    //     const studentTable = document.getElementById('studentTable');
    //     if (studentTable) {
    //         studentTable.innerHTML = '';
    //         this.students.forEach(student => {
    //             const row = document.createElement('tr');
    //             row.style.cursor = 'pointer';
    //             const clickAble = document.querySelectorAll('#clickAble');
    //             row.innerHTML = `
    //                 <td id="clickAble" class="border px-4 py-2">${student.id}</td>
    //                 <td id="clickAble" class="border px-4 py-2">${student.name}</td>
    //                 <td id="clickAble" class="border px-4 py-2">${student.age}</td>
    //                 <td class="border px-4 py-2">
    //                     <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="studentManager.editStudent(${student.id})">Edit</button>
    //                     <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="studentManager.deleteStudent(${student.id})">Delete</button>
    //                 </td>
    //             `;
    //             clickAble.addEventListener('click', () => this.goToStudentDetails(student.id));
    //             studentTable.appendChild(row);
    //         });
    //     }
    // }

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
        const student = this.students.find(s => s.id == this.studentId);
        if (student && !student.courses.includes(courseId)) {
            student.courses.push(courseId);
            this.saveStudents();
            this.loadStudentCourses();
            this.loadAvailableCourses();
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

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    loadStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    loadCourses() {
        return JSON.parse(localStorage.getItem('courses')) || [];
    }
}

const studentManager = new StudentManager();
