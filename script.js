$(".wrapper").hide();
const weatherCardsDiv = document.querySelector(".cards");
function getReady(){
    $.ajax({
        url: "https://api.ipify.org?format=json",
        dataType: "json",
        success: function (data) {
            console.log(data);
            alert("This website is trying to access your IP Address");
            getLatLongFromAPI(data.ip);
        },
        error: {
    
        }
      })
    
}

  function getLatLongFromAPI (ip) {
    $.ajax({
        url:  `http://api.ipstack.com/${ip}?access_key=077d8e43b7fca3f7e71fe17ab0a0d8c3`,
        //dataType: JSON,
        success: function (data){
            console.log(((data)));
            getWeather(((data.latitude)), ((data.longitude)), data.city,data.country_name );
        },
        
    });

    
  }

  

  
  function getWeather(lat, long, name, country){
    $.ajax(
        {
            url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}/?key=6JUJ3PJZUX8R3QQZYEG7VEG9R `,
            dataType: "json",
            success: function (data) {
                $(".wrapper").show();
                console.log(data);
                todays_highlights(data);
                const F = data.currentConditions.temp;
                const  C = (5/9) * (F - 32);
                console.log(Math.trunc(C,2));
                const icons = data.currentConditions.icon;
                console.log(icons);
                updateSideBar(Math.trunc(C,2), name, country, icons, data.currentConditions.datetimeEpoch, data.currentConditions.datetime, data.days[1], data.days[2]);
                // extracting the next 6 day's data from the 15 days data
                const week_data = data.days.slice(1, 7);
                // for updating title according to current condition
                current_weather_condition(data);
                // clearing previous weather data (to not create additional cards)
                weatherCardsDiv.innerHTML = "";
                // adding weather Cards (forecast)
                week_data.forEach((weatherItem) => {
                weatherCardsDiv.insertAdjacentHTML(
                    "beforeend",
                    createWeatherCard(weatherItem)
                );
                //   $(".weatherCardsDiv").append(createWeatherCard(weatherItem));
                });
            },
            error: function (error) {
                //console.log(error);
                
            } 
            
        }
    
    )

}

function todays_highlights(data)

{

    console.log(data);

    $(".uv-index").text(data.currentConditions.uvindex);

    $(".wind-speed").text(data.currentConditions.windspeed+" kmph");

    $(".rain-fall").text(null_check(data.currentConditions.precip)+" mm");

    $(".humidity-per").text(data.currentConditions.humidity+"%");

    $(".feels-temp").text(FtoC(data.currentConditions.feelslike)+" °C");

    $(".sunset-time").text(processing(data.currentConditions.sunset)+" PM");

 

    uv_message(data.currentConditions.uvindex);

    wind_direction(data.currentConditions.winddir);

    predictRainfall(data.currentConditions.precipprob);

    humidity_dew(data.currentConditions.humidity,FtoC(data.currentConditions.feelslike));

    $(".sunrise-time").text("Next Day sunrise at "+processing2(data.days[1].sunrise)+" AM");

}   

function null_check(data)

{

    if(data==null)

    return 0;

    else

    return data;

}

function FtoC(temperature){

    const F = temperature;

    const C = (5/9) * (F - 32);

    return Math.ceil(C);

}

function processing(time)

{

    final="";

    const arr=time.split(":");

    final+=arr[0]-12;

    final+=":"+arr[1];

    return final;

}

function uv_message(uv)

{

    if(uv>=0 && uv<=2)

       $(".uv-text").text("Wear sunglasses on bright days.");

    else if(uv>2 && uv<=5)

        $(".uv-text").text("Stay in shade near midday.");

    else if(uv>5 && uv<=7)

        $(".uv-text").text("Reduce sun time between 10am to 4pm.");

    else

        $(".uv-text").text("Try to avoid sun between 10am to 4pm.");

}

function wind_direction(degrees) {

    degrees = degrees % 360;

    if (degrees < 0) {

      degrees += 360;

    }

    const fullDirections = [

      'North', 'North-Northeast', 'Northeast', 'East-Northeast', 'East', 'East-Southeast', 'Southeast', 'South-Southeast',

      'South', 'South-Southwest', 'Southwest', 'West-Southwest', 'West', 'West-Northwest', 'Northwest', 'North-Northwest'

    ];

    const index = Math.round((degrees % 360) / 22.5);

    

    $(".wind-dir").text("Wind direction "+fullDirections[index]);

}

function predictRainfall(probability) {

      if (probability < 30) {

        $(".rain-fcast").text("Low chance of rainfall");

      } else if (probability < 70) {

        $(".rain-fcast").text("Moderate chance of rainfall");

      } else {

        $(".rain-fcast").text("High chance of rainfall");

      }

}

function humidity_dew(RH,T)

{
    const Tdp = T - ((100 - RH) / 5);

    $(".dew-point").text("The dew point is "+Math.ceil(Tdp)+" right now");

}

function processing2(time)

{
    final="";

    const arr=time.split(":");

    final+=arr[0];

    final+=":"+arr[1];

    return final;

}

function updateSideBar (temp, name, country, icons, datetimeEpoch, datetime,  day1, day2){

 
    update_background(icons);
    $("#temperature").html(temp+"&deg;C");

    $("#loc").html(name + " ," + country);

    

    $("#icon").attr("src",`./weather-icons/${icons}.svg`);

    console.log((datetimeEpoch, datetime));

    const daytime = getDayTime(datetimeEpoch, datetime);

    $("#day-sidebar").html(daytime[0] + " ,"+ daytime[1]);

    console.log(day1.datetimeEpoch, day1.datetime);

    const day1day = getDayTimeNew(day1.datetime);

    $("#image1-text").html(day1day[0]+ ", "+ day1day[2] + " "+  day1day[1] );

    const day2day = getDayTimeNew(day2.datetime);

    $("#image2-text").html(day2day[0]+ ", "+ day2day[2] + " "+  day2day[1] );

    $("#image1-sidebar").attr("src",`./weather-icons/${day1.icon}.svg`);

    $("#image2-sidebar").attr("src",`./weather-icons/${day2.icon}.svg`);



}

function getDayTimeNew(datetime){

    // Create a Date object from the date string
    const dateString = datetime;
    const dateObject = new Date(dateString);
    // Get the day of the week

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayOfWeek = daysOfWeek[dateObject.getDay()];
    // Get the date

    const date = dateObject.getDate();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = months[dateObject.getMonth()];
    return [dayOfWeek, date, month];
}

function getDayTime(datetimeEpoch, datetime){

        const date = new Date(datetimeEpoch * 1000);
        // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        // Get the time in 12-hour format (e.g., 02:30 PM)
        const timeString = datetime; // Replace with your time string
        // Split the time string into hours and minutes
        let [hours, minutes] = timeString.split(':').map(String);
        if(minutes.length == 1){
        minutes=  '0'+minutes;
        }
        Number(hours);
        // Determine whether it's AM or PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        // Convert to 12-hour format
        const hours12 = hours % 12 || 12;

        // Create the formatted time string

        const formattedTime = `${hours12}:${minutes} ${ampm}`;
        return [dayOfWeek, formattedTime];

}

function update_background(icons)
{
    if(icons=="hair" || icons=="rain" || icons=="showers-day" || icons=="showers-night" || icons=="rain-snow-showers-day" || icons=="rain-snow-showers-night" || icons=="thunder-rain"|| icons=="thunder-showers-day" || icons=="thunder-showers-night" || icons=="thunder")
        $(".wrapper")[0].style.backgroundImage  = "url("+"'./images/back-rain.jpeg')";
    else if(icons=="clear-day" || icons=="clear-night" )
        $(".wrapper")[0].style.backgroundImage  = "url("+"'./images/back-sunny.jpeg')";
    else if(icons=="fog" || icons=="rain-snow" || icons=="sleet" || icons=="snow-showers-day" || icons=="snow-showers-night" || icons=="snow")
        $(".wrapper")[0].style.backgroundImage  = "url("+"'./images/back-snow.avif')";
    else if(icons=="cloudy" || icons=="partly-cloudy-day"|| icons=="partly-cloudy-night" || icons=="wind")
        $(".wrapper")[0].style.backgroundImage  = "url("+"'./images/back-cloud.jpeg')";
    else
        $(".wrapper")[0].style.backgroundImage  = "url("+"'./images/rain_green.avif')";
}

function current_weather_condition(data) {
    // adding the current weather condition at the top
    $(".weather-condition").text(data.currentConditions.conditions);
  }
function createWeatherCard(weatherItem) {
    const date = new Date(weatherItem.datetimeEpoch * 1000);
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    console.log(dayOfWeek);
    return `<li class="card">
                <h2 class="day-name">${dayOfWeek}</h2>
                <div class="card-icon">
                <img src="./weather-icons/${
                  weatherItem.icon
                }.svg" alt="no-image" />
                </div>
                <div class="day-temp">
                <h2 class="temp">${FtoC(weatherItem.temp)}</h2>
                <span class="temp-unit"> °C</span>
                </div>
            </li>`;
}



$(document).ready( function () {
    
    
    getReady();
    

    let box = $("#searchBox");
    const searchList = $("#suggestions");

    box.on('input', debounce(searchLocations, 300) );


    function debounce(func, delay) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    function searchLocations() {
        let userInput = box.val();

        //--------------Search bar update---------
        console.log(userInput);
        let filter_input="";
        console.log(userInput.length);
        for(let i=0;i<userInput.length;i++)
        {
            if(userInput[i]===',' || userInput===' ')
            break;
            else
            filter_input+=userInput[i];
        }
        userInput=filter_input;

        console.log("updated data="+userInput);
        //----------------------------------------

        $(".dropdown-container").css( "box-shadow", "0px 5px 10px 0px rgba(0, 0, 0, 0.5)");
        //if(userInput.lenght >= 3){
            $.ajax(
                {
                    url: `http://api.geonames.org/searchJSON?q=${userInput}&name_startsWith=${userInput}&cities=cities1000&fuzzy=0.8&maxRows=5&username=santhi0913`,
                    dataType: "json",
                    success: function (data) {
                        //console.log(data);
                        searchList.empty();
                    
                        $.each(data.geonames,  function (index, location) {
                            const ListItem = $("<li>").text(location.name + " ," + location.countryName);
                            ListItem.addClass("li-bar");
                            ListItem.on('click', function () {
                                box.val(location.name + " ," + location.countryName);
                                getWeather(location.lat,location.lng, location.name, location.countryName);
                                searchList.empty();
                            } )
                            searchList.append(ListItem);
                            
                        });
                    
                    },
                    error: function (error) {
                        //console.log(error);
                        searchList.html("<li>NO results found</li>");
                    } 

                }
            
            )

        searchList.empty();
        $(".dropdown-container").css( "box-shadow", "");
    };


});
