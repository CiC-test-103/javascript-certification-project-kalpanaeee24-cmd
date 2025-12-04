// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises;

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
      this.head=null;
      this.tail=null;
      this.length=0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    const node=new Node(newStudent);
    if(!this.head){
      this.head=node;
      this.tail=node;
    }else{
      this.tail.next=node;
      this.tail=node;
    }
    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    if(!this.head){
      return "No students";
    }
    let current =this.head;
    let previous =null;
    if(current.data.getEmail()===email){
      this.head=current.next;
      this.length--;
      if(this.length===0){
        this.head=null;
        this.tail=null;
      }
      return;
    }
    while(current!=null){
      if(current.data.getEmail()===email){
        previous.next=current.next;
        this.length--;
      if(current===this.tail){
        this.tail=previous;
      }
      return;
    }
     previous=current;
     current = current.next;
    }        
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    let current= this.head;
    while(current!==null){
    if(current.data.getEmail()===email){
      return current.data;
    }
    current=current.next;
    }
    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    this.head=null;
    this.tail=null;
    this.length=0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    if (!this.head){ 
      return "No students in the list";
    }
    let current = this.head;
    let students = [];
    while (current !== null) {
    students.push(current.data.getName());
    current = current.next;
    }
    return students.join(", ");
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    let students=[];
    let current=this.head;
    while(current!==null){
      students.push(current.data);
      current=current.next;
    }
    students.sort((a,b) => a.getName().toLowerCase()> b.getName().toLowerCase() ? 1 : -1);
    this.head = new Node(students[0]);
    let previous=this.head;
    for(let i=1;i < students.length;i++){
      const newNode=new Node(students[i]);
      previous.next=newNode;
      previous=newNode;
    }
    this.tail=previous;
    this.tail.next=null;
  }
  sortList(){
    this.#sortStudentsByName();
  }
  

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    let stud =new LinkedList();
    let current=this.head;
    while(current!=null){
      if(current.data.getSpecialization()===specialization){
         stud.addStudent(current.data);
      }  
      current=current.next;
    }
    stud.sortList();
    const result = [];
    current = stud.head;
    while (current !== null) {
    result.push(current.data);
    current = current.next;
    }
    return result;
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    const stud = new LinkedList();
    let current = this.head;
    while (current !== null) {
    if (current.data.getYear()>=minAge) {
      stud.addStudent(current.data);   
    }
    current = current.next;
    }
    stud.sortList();
    const result = [];
    current = stud.head;
    while (current !== null) {
    result.push(current.data);
    current = current.next;
    }
    return result;
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    try {
       const students = [];
       let current = this.head;
       while (current !== null) {
       students.push({name: current.data.getName(),
        year:  current.data.getYear(),
        email:  current.data.getEmail(),
        specialization:  current.data.getSpecialization()}); 
       current = current.next;
       }
       await fs.writeFile(fileName, JSON.stringify(students,null,2), 'utf-8');
       console.log(`LinkedList saved to ${fileName}`);
    } catch (error) {
      console.log("Error saving LinkedList to JSON:", error);
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    try {
      const data = await fs.readFile(fileName, 'utf-8');
      const studentArray = JSON.parse(data);
      this.clearStudents();
    for (let i=0;i<studentArray.length;i++){
      const studentData = studentArray[i];
      const student = new Student(
        studentData.name,
        studentData.year,
        studentData.email,
        studentData.specialization
      );
      this.addStudent(student);
    }
    console.log(`LinkedList loaded from ${fileName}`);
  } catch (error) {
    console.log("Error loading LinkedList from JSON:", error);
  }
}
  
}

module.exports = { LinkedList }
