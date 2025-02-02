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
      } else if (!this.isCourseNameUnique(name)) {
        this.showError('errorCourseName', 'Course name already exists');
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
  
    isCourseNameUnique(name) {
      return !this.courses.some(course => course.name === name);
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
          <td class="flex justify-center gap-4 px-6 py-2">
            <span class="icon-button icon-update" onclick="courseManager.editCourse(${course.id})">
              <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </span>
            <span class="icon-button icon-delete" onclick="courseManager.deleteCourse(${course.id})">
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </span>
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
  