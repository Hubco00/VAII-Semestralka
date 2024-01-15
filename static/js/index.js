
// const placeHolder = document.querySelector('.placeHolder');

// const plusIcon = document.querySelector('#plus-icon');

// let buttonsVisible = false;


// plusIcon.onmouseenter = function()
// {
//     if(buttonsVisible==false)
//     {          
//         $(".actionButtons").css('opacity', '1');                     
//         buttonsVisible = true;
//     }
// };

// plusIcon.onmouseleave = function()
// {
    
  
//         buttonsVisible = false;
 
// };

// placeHolder.onmouseenter = function()
// {
//     if(buttonsVisible==true)
//     {
//         $(".actionButtons").css('opacity', '1');
//         buttonsVisible = false;
//     }
// };

// placeHolder.onmouseleave = function()
// {    
//     $(".actionButtons").css('opacity', '0');  

// };

// function addTemperatureButton() {
//     let selectedType = ''; 

//     $(".temperatureButton, .humiditybutton, .barometerButton, .co2Button").on('click', function() {
//         const buttonType = $(this).data('type');
    
//         if (buttonType === 'temperature') {           
//             selectedType = 'Temperature';
//         } else if (buttonType === 'humidity') {            
//             selectedType = 'Humidity';
//         } else if (buttonType === 'barometer') {
//             selectedType = 'Barometer';
//         } else if (buttonType === 'co2') {
//             selectedType = 'Co2';
//         }
    
//         let squareId = 0;

       
//         var originalSquare = $(this).closest('.cardSquare');

//         let oldSquareId = "cardSquare" + squareId;
//         originalSquare.attr("id", oldSquareId);

//         var clonedSquare = originalSquare.clone(true);
//         squareId++;
//         let newSquareId = "cardSquare" + squareId;
//         clonedSquare.attr('id', newSquareId);

//         originalSquare.find('.placeHolder').remove().hide();
//         originalSquare.find('.temperatureHolder').css('display', 'grid');

       
//         originalSquare.find('#typeOfIndicator').text(selectedType);
//         originalSquare.after(clonedSquare);
//     });               
// }

function toggleNavigationLinks(isLoggedIn) {
    const homeLink = document.getElementById('homeLink');
    const devicesLink = document.getElementById('devicesLink');
    const registrationLink = document.getElementById('registrationLink');
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logout = document.getElementById('logout');

    if (!isLoggedIn) {
        homeLink.style.display = 'inline-block';
        devicesLink.style.display = 'none';
        registrationLink.style.display = 'inline-block';
        loginLink.style.display = 'inline-block';
        profileLink.style.display = 'none';
        logout.style.display = 'none';
    } else {
        homeLink.style.display = 'inline-block';
        devicesLink.style.display = 'inline-block';
        registrationLink.style.display = 'none';
        loginLink.style.display = 'none';
        profileLink.style.display = 'inline-block';
        logout.style.display = 'inline-block';
    }
}


function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    var registrationData = {
        "username": username,
        "email": email,
        "password": password
    };
    fetch('/registerUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(registrationData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log('Registration successful:', data);
        var registerMessage = document.getElementById('registerMessage');
        console.log(data);
        if(data.message === 'false')
        {
            registerMessage.style.color = 'red';
            registerMessage.innerHTML = 'Wrong data'
        }
        else
        {
            registerMessage.style.color = 'green';
            registerMessage.innerHTML = 'Registered';
        }
       
    });
    
}



 function fetchUserIdAndDelete() {

        fetch('/getUserId')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {

            const fetchedUserId = data.data;
            deleteUser(fetchedUserId);
        })
        .catch(error => {
            console.error('Error:', error);

        });
    }

    function deleteUser(userId) {
        fetch(`/deleteUser/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log('User deleted successfully:', data);

        })
        .catch(error => {
            console.error('Error:', error);

        });
}


function logoutUser() {
    fetch('/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }

    })
    .then(data => {
        console.log('Success:', data);
        $('#homeLink, #registrationLink, #loginLink').css('display', 'inline-block');
        $('#devicesLink, #profileLink, #logout').css('display', 'none');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


$(document).ready(function() {

    $('.info-a-placeholderUser').click(function() {

        var link = $(this).attr('id');

        var newInfo = prompt("Enter new information:"); 
        if (newInfo !== null) { 

            var updateData = {
              
                [link]: newInfo
            };
            fetch('/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                window.location.reload();        
            });            
        }
        
    });
    $('.info-a-placeholderAddress').click(function() {

        var link = $(this).attr('id');
        console.log('Clicked link ID:', link);

        var newInfo = prompt("Enter new information:"); 
        if (newInfo !== null) { 
            console.log(newInfo)

            var updateData = {
              
                [link]: newInfo
            };

            fetch('/updateAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                window.location.reload();        
            });            
        }
        
    });
});



$(document).ready(function() {
    var selectedMonth = getCurrentMonth();
    updateDays(selectedMonth);
    var city = 'Žilina';
    loadTemp(selectedMonth, city);
    loadcurrentWeatherENDAPI(city);
    console.log(selectedMonth);

     $('body').on('click', '.location-link', function(event) {
        event.preventDefault();

        var locationId = $(this).attr('id');
        city = $(this).find('.location-name').text();

        loadTemp(selectedMonth, city);
        loadcurrentWeatherENDAPI(city);

    });

    $('.monthDiv a').each(function() {
        $(this).on('click', function(event) {
            event.preventDefault();
            selectedMonth = $(this).parent().attr('id');
            var month = selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1);
            console.log(month);
            $('.monthDetail').text(month);
            updateDays(selectedMonth);
            loadTemp(selectedMonth, city);
            loadcurrentWeatherENDAPI(city);
        });
    });


});

function updateDetail(selectedMonth)
{

}

function getCurrentMonth() {
    var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var currentMonthIndex = new Date().getMonth();
    return months[currentMonthIndex];
}


function getDaysInMonth(month) {
var monthIndex = {january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11}[month];
var year = new Date().getFullYear();
return new Date(year, monthIndex + 1, 0).getDate();
}

function updateDays(month) {
    var daysContainer = $('.daysDiv');
    daysContainer.empty();
    var numDays = getDaysInMonth(month);
    for (var i = 1; i <= numDays; i++) {
        daysContainer.append(createDayInHtml(i));
    }
}


function createDayInHtml(day) {
    var dayDiv = $('<div>').addClass('day day' + day);
    var dateSpan = $('<span>').addClass('date').text(day);
    var tempSpan = $('<span>').addClass('temp').text('%%');

    dayDiv.append(dateSpan).append(tempSpan);
    return dayDiv;
}

function loadTemp(month, city) {
    var num = getDaysInMonth(month);
    var year = new Date().getFullYear();
    var monthIndex = {january: '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'}[month];

    for (var i = 1; i <= num; i++) {
        var dayString = i < 10 ? '0' + i : i.toString();
        var date = `${year}-${monthIndex}-${dayString}`;
        loadTemperatureFromENDAPI(city, date, 'day' + i);
    }
}
function loadTemperatureFromENDAPI(city, date, dayId) {
    var apiKey = "ac540781f7d74936806184250241401";


    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var queryDate = new Date(date);

    var fourteenDaysLater = new Date();
    fourteenDaysLater.setDate(today.getDate() + 14);

    var url;
   if (queryDate < today) {

        url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${date}`;
    } else if (queryDate <= fourteenDaysLater) {

        url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&dt=${date}`;
    } else {
        url = `http://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${city}&dt=${date}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 0)
            {

                var maxTempC = data.forecast.forecastday[0].day.maxtemp_c;

                $('.' + dayId).find('.temp').text(maxTempC + '°C');
            }
        }).catch(error => console.error('Error:', error));
}

function loadcurrentWeatherENDAPI(city) {
    var apiKey = "ac540781f7d74936806184250241401";
    url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.current)
            {

                var temp = data.current.temp_c;
                var timestamp = data.current.last_updated_epoch;
                var condition = data.current.condition.text;
                var icon = data.current.condition.icon;
                var pressure =data.current.pressure_in;
                var wind = data.current.wind_mph;
                var humidity = data.current.humidity;
                var windDir = data.current.wind_dir;

                var date = new Date(timestamp);
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var formattedHours = hours.toString().padStart(2, '0');
                var formattedMinutes = minutes.toString().padStart(2, '0');
                console.log(timestamp, '  ' , hours, ':' , minutes, '  ', formattedHours, ':', formattedMinutes)
                $('.current-weather-time').text(formattedHours, ':', formattedMinutes);
                $('.weather-image').attr('src', icon);
                $('.current-location-temperature').text(temp);
                $('.current-weather-condition').text(condition);
                $('.windDir').text(windDir);
                $('.wind').text(wind);
                $('.pressure').text(pressure);
                $('.humidity').text(humidity);
            }
        }).catch(error => console.error('Error:', error));
}
$(document).ready(function() {
    var currentPage = window.location.pathname;
    console.log("Current Page: ", currentPage);


    if (currentPage.endsWith("/monthlyWeather") ||
        currentPage.endsWith("/currentWeather") ||
        currentPage.endsWith("/hourlyWeather")) {

        console.log("Fetching data...");

        $.getJSON("http://127.0.0.1:5000/getUsersLocations", function(response) {
            console.log("Data received: ", response);
            if (response.data && Array.isArray(response.data))
            {
                response.data.forEach(function (location){
                    var locationHtml = `
                        <div class="location" id="location${location.id}">
                            <a class="location-link" id="location-link${location.id}"">
                                <span class="location-name">${location.locationName}</span>
                                <span class="temperature">-3°</span>
                                <span class="weather-icon">🌤️</span>
                            </a>
                            <a class="xButton" data-location-id="${location.id}">
                                <i class='bx bx-x' style="color: #cccccc"></i>
                            </a>
                        </div>`;
                     $(".locations-container").append(locationHtml);
                });
            } else {
                console.error("Invalid data format");
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data: ", textStatus, errorThrown);
        });
    }
});


$(document).ready(function () {
    $('#location-search').keydown(function (event) {
        if(event.key === 'Enter') {
            var location = $('#location-search').val();
            console.log(location)
            console.log(JSON.stringify({location: location}));
            fetch("http://127.0.0.1:5000/addLocation", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({location: location})

            })
                .then(res => res.json())
                .then(data => {
                    console.log('Suceess', data);
                }).catch((error) => {
                    console.log('Error: ', error);
            });
             $('#location-search').val('');
             window.location.reload();
        }


    });
});

$(".locations-container").on("click", ".xButton", function() {
    var locationId = $(this).data("location-id");
    console.log("Deleting location with ID:", locationId);


    fetch(`http://127.0.0.1:5000/deleteLocation/${locationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }

    })
    .then(response => {
        if (response.ok) {

            $("#location" + locationId).remove();
            console.log("Location deleted successfully");
        } else {

            console.error("Failed to delete location");
        }
        return response.json();
    })
    .then(data => {

        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});




// addTemperatureButton();