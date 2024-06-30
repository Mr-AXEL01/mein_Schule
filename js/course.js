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
      this.editingCourseId = null; 
  
      this.courseForm.addEventListener('submit', this.handleSubmit.bind(this));
      this.displayCourses();
    }
  
    handleSubmit(event) {
      event.preventDefault();
  
      const name = document.getElementById('courseName').value.trim();
      let isValid = true;
  
      if (!name) {
        this.showError('errorCourseName', 'Name is required');
        isValid = false;
      } else {
        this.showError('errorCourseName', '');
      }
  
      if (isValid) {
        if (this.editingCourseId !== null) {
          const course = this.courses.find(c => c.id === this.editingCourseId);
          course.name = name;
          this.editingCourseId = null;
        } else {
          const id = this.generateId();
          const course = new Course(id, name);
          this.courses.push(course);
        }
  
        this.displayCourses();
        this.saveCourses();
        this.clearForm();
      }
    }
  
    showError(elementId, message) {
      document.getElementById(elementId).textContent = message;
    }
  
    generateId() {
      if (this.courses.length === 0) {
        return 1;
      } else {
        return Math.max(...this.courses.map(course => course.id)) + 1;
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
      const course = this.courses.find(c => c.id === id);
      document.getElementById('courseName').value = course.name;
      this.editingCourseId = id;
    }
  
    deleteCourse(id) {
      this.courses = this.courses.filter(c => c.id !== id);
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
      document.getElementById('courseName').value = '';
      this.showError('errorCourseName', '');
      this.editingCourseId = null;
    }
  }
  
  const courseManager = new CourseManager();
  