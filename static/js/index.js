function addTemperatureButton() {
    let selectedType = '';
    let squareId = 0;

    fetch('/getCountOfDevices')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        squareId = data.data;

    })
    .catch(error => {

        console.error('Fetch error:', error);
    });
    $(".temperatureButton, .humiditybutton, .barometerButton, .co2Button").on('click', function() {
        const buttonType = $(this).data('type');

        if (buttonType === 'temperature') {
            selectedType = 'Temperature';
        } else if (buttonType === 'humidity') {
            selectedType = 'Humidity';
        } else if (buttonType === 'barometer') {
            selectedType = 'Barometer';
        } else if (buttonType === 'co2') {
            selectedType = 'Co2';
        }

        var originalSquare = $(this).closest('.cardSquare');

        let oldSquareId = "cardSquare" + squareId;
        originalSquare.attr("id", oldSquareId);
        var clonedSquare = originalSquare.clone(true);
        squareId++;
        let newSquareId = "cardSquare" + squareId;
        clonedSquare.attr('id', newSquareId);

        originalSquare.find('.placeHolder').remove().hide();
        originalSquare.find('.temperatureHolder').css('display', 'grid');

        originalSquare.find('#typeOfIndicator').text(selectedType);
        originalSquare.after(clonedSquare);
        var origId = originalSquare.attr("id");
        var input = originalSquare.find('.city-input-device');
        input.keydown(function(event) {
            if (event.key === 'Enter') {
                var location = input.val();


                fetch('/addDevice', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ device: selectedType, city: location, deviceId: origId})
                    })
                    .then(response => response.json())
                    .then(data => {


                    })
                    .catch(error => {

                        console.error(error);
                    });

                input.hide();
            }
        });
    });
}
function loadSquaresFromDevices() {

    let squareIdNum = 0;
    $.getJSON('/getDevices')
        .done(function(response) {
            const data = response.data;


            $.each(data, function(index, device) {
                const selectedType = device.type;


                const squareContainer = $('.squareContainer');
                const originalCardSquare = squareContainer.find('.cardSquare').first();


                var clonedSquare = originalCardSquare.clone(true);
                let newSquareId = "cardSquare" + squareIdNum;
                squareIdNum++;

                clonedSquare.attr('id', newSquareId);


                clonedSquare.find('.placeHolder').remove().hide();
                clonedSquare.find('.temperatureHolder').css('display', 'grid');
                clonedSquare.find('.city-input-device').remove().hide();


                clonedSquare.insertBefore(originalCardSquare);
            });
        })
        .fail(function(error) {

            console.error(error);
        });
}

function loadSquaresDataFromDevices() {

    fetch('/getDevices')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var devicesData = data.data;
        devicesData.forEach(function(device) {

            $(`#${device.id}`).find('#typeOfIndicator').text(device.type);
            $(`#${device.id}`).find('.city-text-device').text(device.city);

            loadcurrentWeatherENDAPIInDevice(device.city, device.id)
        });

    })
    .catch(error => {

        console.error('Fetch error:', error);
    });
}
function loadcurrentWeatherENDAPIInDevice(city, cardId) {
    var apiKey = "ac540781f7d74936806184250241401";
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.current)
            {
                card = $(`#${cardId}`);
                if(card.find('#typeOfIndicator').text() === 'Temperature') {
                    card.find('#temperature').text(data.current.temp_c + '°C')
                }
                else if (card.find('#typeOfIndicator').text() === 'Humidity')
                {
                    card.find('#temperature').text(data.current.humidity)
                }
                else if(card.find('#typeOfIndicator').text() === 'Barometer')
                {
                     card.find('#temperature').text(data.current.pressure_in + 'in')
                }
                else if(card.find('#typeOfIndicator').text() === 'Co2')
                {
                    card.find('#temperature').text(data.current.precip_mm)
                }


            }
        }).catch(error => console.error('Error:', error));
}




$(document).ready(function() {
    $('#registration-form').submit(function(event) {
        event.preventDefault();
        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();
        var registerMessage = $('#registrationMessage');
        if (password !== confirmPassword) {
            registerMessage.css('color', 'red').text('Passwords do not match.');
            return;
        }

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
                if(!response.ok)
                {
                     throw new Error('Network response was not ok');
                }
                return response.json();
        })
        .then(data => {



            if(data.message === 'false') {
                registerMessage.css('color', 'red').text('Registration failed: Wrong data');
            }
            else if(data.message === 'false-password')
            {
                registerMessage.css('color', 'red').text('Registration failed: Short password');

            }
            else if(data.message === 'user-exists')
            {
                registerMessage.css('color', 'red').text('Registration failed: This username is taken.');
            }
            else if(data.message === 'email-exists')
            {
                registerMessage.css('color', 'red').text('Registration failed: This email is taken.');
            }
             else if(data.message === 'database-error')
            {
                registerMessage.css('color', 'red').text('Registration failed: Error occurred');
            }
            else {
                registerMessage.css('color', 'green').text('Registration successful!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $('#registerMessage').css('color', 'red').text('Registration failed: Error occurred');
        });
    });
});

$(document).ready(function () {

   $('.login-button').on('click',function(event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then(response => {
                if(!response.ok)
                {
                     throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                if(data.message === "false")
                {
                    $('#loginMessage').css('color', 'red').text("Wrong credentials.");


                }
                else
                {
                    window.location.href = '/';

                }
            }).catch(error => {
                console.error('Error: ' + error);
                $('#loginMessage').css('color', 'red').text('Login failed');
        });
   });
});



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
            window.location.reload();
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
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


$(document).ready(function() {

    $('.info-a-placeholderUser').click(function() {
        var link = $(this).attr('id');
        var id = $(this).find('.input-profile').attr('id');
        $(this).find('.info-data-div span').css('display', 'none');
        $(`#${id}`).css('display', 'block');
        $(`#${id}`).focus();
        $(`#${id}`).keydown(function(event) {
            if (event.key === 'Enter') {
                var newInfo = $(`#${id}`).val();
                if (newInfo !== "")
                {

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
                $(this).closest('.info-a-placeholderUser').find('.info-data-div span').css('display', 'block');
                $(`#${id}`).hide();


            }  else if (event.key === 'Escape')
            {
                $(this).closest('.info-a-placeholderUser').find('.info-data-div span').css('display', 'block');
                $(`#${id}`).css('display', 'none');
            }
        });


        
    });
    $('.info-a-placeholderAddress').click(function() {
        var link = $(this).attr('id');
        var id = $(this).find('.input-profile').attr('id');
        $(this).find('.info-data-div span').css('display', 'none');
        $(`#${id}`).css('display', 'block');
        $(`#${id}`).focus();
        $(`#${id}`).keydown(function(event) {
            if (event.key === 'Enter') {
                var newInfo = $(`#${id}`).val();
                if (newInfo !== "")
                {

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
                $(this).closest('.info-a-placeholderAddress').find('.info-data-div span').css('display', 'block');
                $(`#${id}`).hide();

            } else if (event.key === 'Escape')
            {
                $(this).closest('.info-a-placeholderAddress').find('.info-data-div span').css('display', 'block');
                $(`#${id}`).css('display', 'none');
            }
        });
    });
});





$(document).ready(function() {
    if (window.location.pathname.endsWith("/monthlyWeather")) {
        let selectedMonth = getCurrentMonth();
        updateDays(selectedMonth);
        let city = 'Žilina';
        loadTemp(selectedMonth, city);
        loadcurrentWeatherENDAPI(city);
        $('.loaction-name').text(city);


        $('body').on('click', '.location-link', function (event) {
            event.preventDefault();

            var locationId = $(this).attr('id');
            city = $(this).find('.location-name').text();

            loadTemp(selectedMonth, city);
            loadcurrentWeatherENDAPI(city);
            $('.loaction-name').text(city);

        });

        $('.monthDiv a').each(function () {
            $(this).on('click', function (event) {
                event.preventDefault();
                selectedMonth = $(this).parent().attr('id');
                var month = selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1);

                $('.monthDetail').text(month);
                updateDays(selectedMonth);
                loadTemp(selectedMonth, city);
                loadcurrentWeatherENDAPI(city);
            });
        });
    }
});

$(document).ready(function() {

    if (window.location.pathname.endsWith('currentWeather')) {
        var selectedMonth = getCurrentMonth();
        var city = 'Žilina';
        var curDateFormated = getCurrentDateFormatted();
        $('.loaction-name').text(city);

        loadWeatherApiDataForCurWeather(city,curDateFormated);


        $('body').on('click', '.location-link', function (event) {
            event.preventDefault();

            var locationId = $(this).attr('id');
            city = $(this).find('.location-name').text();
            loadWeatherApiDataForCurWeather(city, curDateFormated);
            $('.loaction-name').text(city);
        });
    }
});

$(document).ready(function() {

    if (window.location.pathname.endsWith('hourlyWeather')) {
        var selectedMonth = getCurrentMonth();
        var city = 'Žilina';
        var curDateFormated = getCurrentDateFormatted();
        $('.loaction-name').text(city);

        loadWeatherApiDataForHourlyWeather(city, curDateFormated);


        $('body').on('click', '.location-link', function (event) {
            event.preventDefault();

            var locationId = $(this).attr('id');
            city = $(this).find('.location-name').text();
            loadWeatherApiDataForHourlyWeather(city, curDateFormated);
            $('.loaction-name').text(city);
        });
    }
});


$(document).ready(function() {
    if (window.location.pathname.endsWith('/')) {
        var city = 'Žilina';
        $('.loaction-name').text(city);

        loadcurrentWeatherENDAPI(city);

        $('body').on('click', '.location-link', function (event) {
            event.preventDefault();

            var locationId = $(this).attr('id');
            city = $(this).find('.location-name').text();
            loadcurrentWeatherENDAPI(city);
            $('.loaction-name').text(city);
        });
    }
});

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

function getCurrentDateFormatted() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
}

function loadTemp(month, city) {
    var num = getDaysInMonth(month);
    var year = new Date().getFullYear();
    var monthIndex = {january: '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'}[month];
    var date = `${year}-${monthIndex}-01`;
    loadDetails(city, date);
    var avghigh = 0;
    var avglow = 0;
    var tempH = 0;
    var tempL = 0;
    for (var i = 1; i <= num; i++) {
        var dayString = i < 10 ? '0' + i : i.toString();
        date = `${year}-${monthIndex}-${dayString}`;
        loadTemperatureFromENDAPI(city, date, 'day' + i);
        loadAverageHight(city, date, function (maxtemp) {
            avghigh += maxtemp;
            tempH++;

            if(tempH === num) {
                $('.stat-value-ah').text(parseFloat((avghigh/num).toFixed(1)) + '°C');

            }
        });
        loadAverageLow(city, date, function (lowtemp) {
            avglow += lowtemp;
            tempL++;
            if(tempL === num) {
                $('.stat-value-al').text(parseFloat((avglow/num).toFixed(1)) + '°C');
            }
        });
    }


}

function loadAverageLow(city, date, callback)
{
    var avglow;
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
            avglow = data.forecast.forecastday[0].day.mintemp_c;
            callback(avglow);

        }).catch(error => console.error('Error:', error));

}
function loadAverageHight(city, date, callback) {
    var avgHigh;
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
            avgHigh = data.forecast.forecastday[0].day.maxtemp_c;
            callback(avgHigh);
        }).catch(error => console.error('Error:', error));

}
function loadDetails(city, date)
{
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
            var sunrise = data.forecast.forecastday[0].astro.sunrise;
            var sunset = data.forecast.forecastday[0].astro.sunset;
            $('.stat-value-sunrise').text(sunrise);
            $('.stat-value-sunset').text(sunset);
        }).catch(error => console.error('Error:', error));
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

                let nightTemp = null;
                let dayTemp = null;
                var jsonHour = data.forecast.forecastday.hour;
                for(let i = 0; i < jsonHour.length; i++)
                {
                    if(nightTemp === null && jsonHour.is_day === 0)
                    {
                        nightTemp = jsonHour.temp_c;
                    }

                    if(dayTemp === null && jsonHour.is_day === 1)
                    {
                        dayTemp = jsonHour.temp_c;
                    }

                    if(nightTemp !== null && dayTemp !== null)
                    {
                        break;
                    }
                }
                $('#cur-weather-night').text(nightTemp);
                $('#cur-weather-day').text(dayTemp);
                loadByDayPart(jsonHour);
                getHourTempFromCurrentTime(data);
            }
        }).catch(error => console.error('Error:', error));
}

function loadWeatherApiDataForCurWeather(city, date) {
    var apiKey = "ac540781f7d74936806184250241401";

    url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&dt=${date}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            $('.weather-loc-cur').text(data.location.name)
            if(data.current)
            {
                $('#weather-cur-temp').text(data.current.temp_c + '°C');
                $('#weather-cur-cond').text(data.current.condition.text);
                $('#weather-cur-icon').attr('src', data.current.condition.icon);

            }

            if (data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 0)
            {
                let nightTemp = null;
                let dayTemp = null;
                var jsonHour = data.forecast.forecastday[0].hour;

                for(let i = 0; i < jsonHour.length; i++)
                {
                    if(nightTemp === null && jsonHour[i].is_day === 0)
                    {
                        nightTemp = jsonHour[i].temp_c;
                    }

                    if(dayTemp === null && jsonHour[i].is_day === 1)
                    {
                        dayTemp = jsonHour[i].temp_c;
                    }

                    if(nightTemp !== null && dayTemp !== null)
                    {
                        break;
                    }
                }

                $('#cur-weather-night').text('Night ' + nightTemp + '°C');
                $('#cur-weather-day').text('Day ' + dayTemp + '°C');
                loadByDayPart(jsonHour);
                getHourTempFromCurrentTime(data);
            }
        }).catch(error => console.error('Error:', error));
}

function loadWeatherApiDataForHourlyWeather(city, date) {
    var apiKey = "ac540781f7d74936806184250241401";

    url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&dt=${date}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {


            if (data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 0)
            {

                getHourTemps(data);
            }
        }).catch(error => console.error('Error:', error));
}
function loadByDayPart(jsonHour)
{
    jsonHour.forEach(dayPart => {
        let hour = parseInt(dayPart.time.split(' ')[1].split(':')[0]);

        if(hour >= 6 && hour < 12)
        {
            $('#day-part-morning-temp').text(dayPart.temp_c + '°C');
            $('#day-part-morning-icon').attr('src', dayPart.condition.icon);
            $('#day-part-morning-rain-par').text(dayPart.precip_mm + 'mm');
        }
       else if (hour >= 12 && hour < 17)
       {
            $('#day-part-afternoon-temp').text(dayPart.temp_c + '°C');
            $('#day-part-afternoon-icon').attr('src', dayPart.condition.icon);
            $('#day-part-afternoon-rain-par').text(dayPart.precip_mm + 'mm');
       } else if (hour >= 17 && hour < 21)
       {
            $('#day-part-evening-temp').text(dayPart.temp_c + '°C');
            $('#day-part-evening-icon').attr('src', dayPart.condition.icon);
            $('#day-part-evening-rain-par').text(dayPart.precip_mm + 'mm');
       } else
       {
            $('#day-part-night-temp').text(dayPart.temp_c + '°C');
            $('#day-part-night-icon').attr('src', dayPart.condition.icon);
            $('#day-part-night-rain-par').text(dayPart.precip_mm + 'mm');
       }

    })

}

function getHourTempFromCurrentTime(data)
{
    let timestamp = data.location.localtime;
    let localTime = new Date(timestamp).getHours();

    let found = false;
    let hourCount = 0;

    data.forecast.forecastday[0].hour.forEach(hour => {
        let hourData = new Date(hour.time).getHours();
        if(!found && hourData === localTime)
        {
            found = true;
        }
        let timeString = hour.time.split(" ")[1];

        if(found && hourCount < 5)
        {
   ;
            if(hourCount === 0)
            {

                $('#cur-hour-temp-1').text(hour.temp_c + '°C');
                $('#cur-hour-icon-1').attr('src', hour.condition.icon);
                $('#cur-hour-precip-1').text(hour.precip_mm + 'mm');
                hourCount++;
            }
            else if(hourCount === 1)
            {

                $('#cur-hour-2').text(timeString);
                $('#cur-hour-temp-2').text(hour.temp_c + '°C');
                $('#cur-hour-icon-2').attr('src', hour.condition.icon);
                $('#cur-hour-precip-2').text(hour.precip_mm + ' mm');
                hourCount++;
            }
            else if(hourCount === 2)
            {

                $('#cur-hour-3').text(timeString);
                $('#cur-hour-temp-3').text(hour.temp_c + '°C');
                $('#cur-hour-icon-3').attr('src', hour.condition.icon);
                $('#cur-hour-precip-3').text(hour.precip_mm + ' mm');
                hourCount++;

            }
            else if(hourCount === 3)
            {

                $('#cur-hour-4').text(timeString);
                $('#cur-hour-temp-4').text(hour.temp_c + '°C');
                $('#cur-hour-icon-4').attr('src', hour.condition.icon);
                $('#cur-hour-precip-4').text(hour.precip_mm + 'mm');
                hourCount++;
            }
            else if(hourCount === 4)
            {

                $('#cur-hour-5').text(timeString);
                $('#cur-hour-temp-5').text(hour.temp_c + '°C');
                $('#cur-hour-icon-5').attr('src', hour.condition.icon);
                $('#cur-hour-precip-5').text(hour.precip_mm + 'mm');
                hourCount++;
            }
        }
    })
}

function getHourTemps(data)
{

    let hourCount = 0;

    data.forecast.forecastday[0].hour.forEach(hour => {
        let id = `#forecast-item-${hourCount}`;
        $(id).find('.time-hour').text(hour.time.split(" ")[1]);
        $(id).find('.temperature-hour').text(hour.temp_c);
        $(id).find('.condition-hour').text(hour.condition.text);
        $(id).find('.precipitation-hour').text(hour.precip_mm + 'mm');
        $(id).find('.pressureHourly').text(hour.pressure_in);
        $(id).find('.wind-hour').text(hour.wind_dir + ' ' + hour.wind_kph + 'km/h');
        hourCount++;
    });
}

function loadcurrentWeatherENDAPI(city) {
    var apiKey = "ac540781f7d74936806184250241401";
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.current)
            {

                var temp = data.current.temp_c;

                var condition = data.current.condition.text;
                var icon = data.current.condition.icon;
                var pressure =data.current.pressure_in;
                var wind = data.current.wind_mph;
                var humidity = data.current.humidity;
                var windDir = data.current.wind_dir;
                var visibility = data.current.vis_km;



                var date = new Date();
                var hours = date.getHours().toString().padStart(2,'0');
                var minutes = date.getMinutes().toString().padStart(2, '0');;
                var time = `${hours}:${minutes}`;
                $('.current-weather-time').text(time);
                $('.weather-image').attr('src', icon);
                $('.current-location-temperature-monthly').text(temp + '°C');
                $('.current-location-temperature').text(temp + '°C');

                $('.current-weather-condition').text(condition);
                $('.windDir').text(windDir);
                $('.wind').text(wind);
                $('.pressure').text(pressure);
                $('.humidity').text(humidity);
                $('.visibility').text(visibility);

            }
        }).catch(error => console.error('Error:', error));
}


$(document).ready(function() {
    var currentPage = window.location.pathname;



    if (currentPage.endsWith("/monthlyWeather") ||
        currentPage.endsWith("/currentWeather") ||
        currentPage.endsWith("/hourlyWeather") ||
        currentPage.endsWith("/")) {



        $.getJSON("http://127.0.0.1:5000/getUsersLocations", function(response) {

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


    })
    .catch(error => {
        console.error('Error:', error);
    });
});

$(document).ready(function () {
   $.getJSON('http://127.0.0.1:5000/getUserLoggedIn', function (data) {
      if(data.success === 'true')
      {
          $('.logged-out').hide();
          $('.logged-in').show();

      }
      else
      {
          $('.logged-out').show();
          $('.logged-in').hide()

      }
   });
});


$(document).ready(function() {
    $('#menu-icon').click(function() {
        $('.navigation').toggle('drop-down');
    });
});

$(document).ready(function() {
    fetch('/getAllUsers')
        .then(response => response.json())
        .then(data => {
            const users = data.users;
            const userList = $('#userList');

            userList.empty();

            users.forEach(user => {

                const userDiv = $('<div>', { class: 'user' });
                const userInfoDiv = $('<div>', { class: 'user-info' });
                const userNameSpan = $('<span>', { class: 'user-name', text: user.name });
                const userEmailSpan = $('<span>', { class: 'user-email', text: user.email });
                const banButton = $('<button>', {
                    class: 'ban-button',
                    text: 'Ban',
                    click: function() { deleteUser(user.id); }
                });

                const setAdminButton = $('<button>', {
                    class: 'admin-button',
                    text: 'Promote',
                    click: function() { setAdmin(user.name); }
                });
                userInfoDiv.append(userNameSpan, userEmailSpan);
                userDiv.append(userInfoDiv, setAdminButton, banButton);
                userList.append(userDiv);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
});

$(document).ready(function() {
    if (window.location.pathname.endsWith("/profile")) {
        fetch('/getIsAdmin')
        .then(response => response.json())
        .then(data => {
            const isAdmin = data.data;
            console.log(isAdmin);
            if(isAdmin === 1)
            {
                $('.admin-page').css('display', 'block');
            }
            else
            {
                 $('.admin-page').css('display', 'none');
            }
        })
        .catch(error => console.error('Error fetching users:', error));
    }
});


function setAdmin(username)
{
    fetch('/setAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username})
    })
    .then(response => response.json())
    .catch(error => {

        console.error(error);
    });
}


addTemperatureButton();
loadSquaresFromDevices()
loadSquaresDataFromDevices();