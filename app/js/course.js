class Course {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  }
  
  class CourseManager {
    constructor() {
      this.courses = this.loadCourses();
      this.courseForm = document.getElementById('courseForm');
      this.courseTable = document.getElementById('courseTable');
  
      this.courseForm.addEventListener('submit', this.handleSubmit.bind(this));
      this.displayCourses();
    }
  
    handleSubmit(event) {
      event.preventDefault();
  
      const id = document.getElementById('courseId').value;
      const name = document.getElementById('courseName').value;
  
      const course = new Course(id, name);
      this.addOrUpdateCourse(course);
      this.displayCourses();
      this.saveCourses();
      this.clearForm();
    }
  
    addOrUpdateCourse(course) {
      const existingCourseIndex = this.courses.findIndex(c => c.id == course.id);
      if (existingCourseIndex !== -1) {
        this.courses[existingCourseIndex] = course;
      } else {
        this.courses.push(course);
      }
    }
  
    displayCourses() {
      this.courseTable.innerHTML = '';
  
      this.courses.forEach(course => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td class="border px-4 py-2">${course.id}</td>
          <td class="border px-4 py-2">${course.name}</td>
          <td class="border px-4 py-2">
            <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="courseManager.editCourse(${course.id})">Update</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="courseManager.deleteCourse(${course.id})">Delete</button>
          </td>
        `;
  
        this.courseTable.appendChild(row);
      });
    }
  
    editCourse(id) {
      const course = this.courses.find(c => c.id == id);
      document.getElementById('courseId').value = course.id;
      document.getElementById('courseName').value = course.name;
    }
  
    deleteCourse(id) {
      this.courses = this.courses.filter(c => c.id != id);
      this.displayCourses();
      this.saveCourses();
    }
  
    saveCourses() {
      localStorage.setItem('courses', JSON.stringify(this.courses));
    }
  
    loadCourses() {
      return JSON.parse(localStorage.getItem('courses')) || [];
    }
  
    clearForm() {
      document.getElementById('courseId').value = '';
      document.getElementById('courseName').value = '';
    }
  }
  
  const courseManager = new CourseManager();
  