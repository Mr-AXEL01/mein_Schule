class Student {
    constructor(id, name, age) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.courses = [];
    }
  
    addStudent(student) {
      // logic to add student
    }
  
    updateStudent(updatedStudent) {
      // logic to update student
    }
  
    removeStudent(studentId) {
      // logic to remove student
    }
  
    getStudentDetails(studentId) {
      // logic to get student details
    }
  
    setCourse(course) {
      this.courses.push(course);
    }
  
    getCourse() {
      return this.courses;
    }
  }
  