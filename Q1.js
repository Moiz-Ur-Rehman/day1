const prompt = require("prompt-sync")({ sigint: true });
var employees = [];

function addEmployee() {
  var choice = "y";
  let tax = 0;
  let minSalary = 0;
  let e = {};
  do {
    const employeeName = prompt("Enter employee name: ");
    const employeeSalary = parseInt(prompt("Enter employee salary: "));
    tax = employeeSalary * 0.04;
    minSalary = employeeSalary - tax;
    e = {
      Name: employeeName,
      Salary: employeeSalary,
      Tax: tax,
      MinSalary: minSalary,
    };
    employees.push(e);
    choice = prompt("Do you want to add another employee? (y/n) ");
  } while (choice == "y" || choice == "Y");
  menu();
}

function viewEmployees() {
  if (employees.length == 0) {
    console.log("No employees to display");
  } else {
    console.log("Employee list: ", employees);
  }
  console.log("");
  menu();
}

function deleteEmployee() {
  const employeeName = prompt("Enter employee name to delete: ");
  let found = false;
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].Name == employeeName) {
      employees.splice(i, 1);
      found = true;
      console.log("Employee deleted!");
    }
  }
  if (!found) {
    console.log("Employee not found!");
  }
  console.log("");
  menu();
}

function updateEmployee() {
  const employeeName = prompt("Enter employee name to update: ");
  let found = false;
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].Name == employeeName) {
      const employeeSalary = parseInt(prompt("Enter employee salary: "));
      const tax = employeeSalary * 0.04;
      const minSalary = employeeSalary - tax;
      employees[i].Salary = employeeSalary;
      employees[i].Tax = tax;
      employees[i].MinSalary = minSalary;
      found = true;
      console.log("Employee updated!");
    }
  }
  if (!found) {
    console.log("Employee not found!");
  }
  console.log("");
  menu();
}

function menu() {
  console.log("-----MENU-----");
  console.log("1. Add employees");
  console.log("2. View all employees");
  console.log("3. Delete an employee");
  console.log("4. Update an employee salary");
  console.log("5. Exit");
  const option = parseInt(prompt("Enter your choice: "));
  if (option == 1) {
    addEmployee();
  } else if (option == 2) {
    viewEmployees();
  } else if (option == 3) {
    deleteEmployee();
  } else if (option == 4) {
    updateEmployee();
  } else if (option == 5) {
    console.log("Thank you!");
  } else {
    console.log("Invalid option!");
  }
}
menu();
