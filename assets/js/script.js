var apiKey = 'Baea669456e5e8582bc6fcb7e15ee38bc52cc480'

// Initializing Materialize DropDown
/////////////////////////////////////////////
//NOTE: During initial set-up, this was throwing an error. I removed "options" from the parameter in order to get it working. The commented out code is the original code. 


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });

  // document.addEventListener('DOMContentLoaded', function() {
  //   var elems = document.querySelectorAll('select');
  //   var instances = M.FormSelect.init(elems, options);
  // });



  



// Initializing Materialize DatePicker
/////////////////////////////////////////////
//NOTE: During initial set-up, this was throwing an error. I removed "options" from the parameter in order to get it working. The commented out code is the original code.


  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems);
  });

  // document.addEventListener('DOMContentLoaded', function() {
  //   var elems = document.querySelectorAll('.datepicker');
  //   var instances = M.Datepicker.init(elems, options);
  // });

var thisYearData;
var nextYearData;

function fetchFilteredHolidays(event)
{
  // stops page reload on submit
  event.preventDefault();

  // initialize thisYearData and nextYearData
  thisYearData = false;
  nextYearData = false;

  // find this year
  var thisYear = parseInt( moment().format("yyyy"));

  // get the selected country
  var country = ""// Make this value equal the value from the country selector element

  if (country === "")
  {
    country = "US"
  }

  // get this year
  fetch("https://calendarific.com/api/v2/holidays?&api_key=" + apiKey + "&country="+country+"&year="+thisYear)
  .then(function (response){
    return response.json();
  })
  .then(function (data)
  {
    thisYearData = data;

    getFilteredHolidays();
  })

  // get next year
  fetch("https://calendarific.com/api/v2/holidays?&api_key=" + apiKey + "&country="+country+"&year="+(thisYear+1))
  .then(function (responce){
    return responce.json();
  })
  .then(function (data)
  {
    nextYearData = data;

    getFilteredHolidays();
  })
}


function getFilteredHolidays()
{
  // returns if either thisYearData or nextYearData isn't loaded
  // when either fetch request finishes it will call this function, so the first one should always fail this
  if (! thisYearData || !nextYearData)
  {
    return;
  }

  var startTimeFilterData = "2021-02-05"; // TODO make these have the value of the date filter elements
  var endTimeFilterData = "2021-07-15";

  var filteredData = thisYearData.response.holidays.concat(nextYearData.response.holidays);

  

  if (startTimeFilterData !== "" && endTimeFilterData !== "")
  {
    var startTimeMoment = moment(startTimeFilterData);
    var endTimeMoment = moment(endTimeFilterData);

    var tempData = []

    for (var i = 0; i < filteredData.length; i++)
    {
      
      var holidayMoment = moment(filteredData[i].date.iso);


      if (startTimeMoment.isBefore(holidayMoment) && holidayMoment.isBefore(endTimeMoment))
      {
        tempData.push(filteredData[i]);
      }
    }

    filteredData = tempData;
  } 

  //TODO print each element in filteredData using Nicks function
}

document.querySelector("form").addEventListener("submit",fetchFilteredHolidays)
