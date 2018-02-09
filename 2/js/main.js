/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
*Name: Jung Soo Choi Student ID: 134708155 Date: Febuary 7th, 2018
*
*
********************************************************************************/



$(function() {

let employeesModel = [];    
    
let initializeEmployeeModel = () => {

    $.ajax({
        url: 'https://team-api-jschoi8.herokuapp.com/employees',
        type: 'GET',
        contentType: 'application/json'
    }).done(function (employees){
        
        employeesModel = _.take(employees, 300);

        refreshEmployeeRows(employeesModel);
    }).fail(function (err)
    {
        showGenericModal('Error', 'Unable to get Employees');
        
    });

   }

let showGenericModal = (title, message) => {
    $(".modal-title").html(title);
    $(".modal-body").html(message);
    $("#genericModal").modal('show');
}


let template1 = _.template('<% _.forEach(employees, function(employees) { %>' +
    '<div class="row body-row" data-id="<%- employees._id %>">' +
    '<div class="col-xs-4 body-column"><%- employees.FirstName %></div>' +
    '<div class="col-xs-4 body-column"><%- employees.LastName %></div>' +
    '<div class="col-xs-4 body-column"><%- employees.Position.PositionName %></div>' + '</div>' + '<% }); %>');


let refreshEmployeeRows = (employees) => {

    let temp1 =  template1({ 'employees': employees });

    $('#employees-table').empty();
    $('#employees-table').html(temp1);
}


let getFilteredEmployeesModel = (filterString) => {
    

  var filtered;

  var caseinsensitiveSearch = new RegExp(filterString, 'i');
  
  filtered = _.filter(employeesModel, function(employees){

    if(employees.FirstName.search(caseinsensitiveSearch) != -1 || 
    employees.LastName.search(caseinsensitiveSearch) != -1 ||
    employees.Position.PositionName.search(caseinsensitiveSearch) != -1){
        
        return employees;
    }

  });

    return filtered;
};

    let getEmployeeModelById = (id) => {

        let employeeFound = _.find(employeesModel, function (employees) {
            
            return employees._id == id
        });

        return employeeFound;
    };

$('#employee-search').on('keyup', function()
{


    var searchField = $('#employee-search').val();


    refreshEmployeeRows(getFilteredEmployeesModel(searchField));
});

let employeesTemplate = _.template('<strong>Address:</strong><%- employees.AddressStreet %> <%- employees.AddressCity %>, <%- employees.AddressState %> <%- employees.AddressZip %> <br>' +
'<strong>Phone Number:</strong> <%- employees.PhoneNum %> ext: <%- employees.Extension %><br>' +
'<strong>Hire Date:</strong> <%- employees.HireDate %>');

$('.bootstrap-header-table').on('click', '.body-row', function() {
    
    let employeeFound = getEmployeeModelById($(this).attr('data-id'));

    let fullName = employeeFound.FirstName + ' ' + employeeFound.LastName;

    let mDate = moment(employeeFound.HireDate);
    
    mDate.utc();

    let empDate = mDate.format('LL');

    employeeFound.HireDate = empDate;

    let empInfo = employeesTemplate({'employees' : employeeFound});

    showGenericModal(fullName, empInfo);


});


    initializeEmployeeModel();
  });