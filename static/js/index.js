
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
        // Fetch the user ID from the server
        fetch('/getUserId')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Get the user ID from the fetched data
            const fetchedUserId = data.data;
            deleteUser(fetchedUserId);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
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
            // Optionally, perform actions after successful deletion
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
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
    // Click event for all elements with class 'info-a-placeholder'
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




// addTemperatureButton();