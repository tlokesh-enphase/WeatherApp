$(document).ready( function () {
    
    // else{

    //}


//     $("#searchButton").click( function (event) {
//         event.preventDefault();
//         var userInput = $("#searchBox").val();
    
//         //debounce(searchLocations, 300);
//         console.log("im here");
//             $.ajax(
//                 {
//                     url: `http://api.geonames.org/searchJSON?q=${userInput}&name_startsWith=${userInput}&cities=cities1000&fuzzy=0.8&maxRows=5&username=santhi0913`,
//                     dataType: "json",
//                     success: function (data) {
//                         console.log(data);
//                     },
//                     error: function (error) {
//                         console.log(error);
//                     } 
    
//                 }
//             )

//     });
//     function debounce(func, delay) {
//         let timeout;
//         return function () {
//             const context = this;
//             const args = arguments;
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func.apply(context, args), delay);
//         };
//     };
    
       

//    

let box = $("#searchBox");
const searchList = $("#suggestions");

box.on('input', debounce(searchLocations, 600) );


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
const userInput = box.val();
console.log(userInput);
//if(userInput.lenght >= 3){
    $.ajax(
        {
            url: `http://api.geonames.org/searchJSON?q=${userInput}&name_startsWith=${userInput}&cities=cities1000&fuzzy=0.8&maxRows=5&username=santhi0913`,
            dataType: "json",
            success: function (data) {
                //console.log(data);
                $.each(data.geonames,  function (index, location) {
                    const ListItem = $("<li>").text(location.name + " ," + location.countryName);
                    ListItem.addClass("li-bar ");
                    ListItem.on('click', function () {
                        box.val(location.name + " ," + location.countryName);
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
// }
// else{

// }


};


})