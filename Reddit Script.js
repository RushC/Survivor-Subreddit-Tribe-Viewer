analyzePage();

/**
 * Does everything.
 */
function analyzePage() {
    // The letters for each of the tribes.
    var redTribeLetters = "AaMmFfJjKkPpYyVvQq137".split("");
    var greenTribeLetters = "BbEeLlDdNnUuTtWwZz256".split("");
    var blueTribeLetters = "CcHhIiGgOoRrSsXx0489".split("");

    // Create all of the tribes.
    var redTribe = new Tribe("rgb(204,0,0)", "Red Tribe");
    var greenTribe = new Tribe("rgb(0,204,0)", "Green Tribe");
    var blueTribe = new Tribe("rgb(0,0,204)", "Blue Tribe");

    // Add all of the found users on the page to their respective tribes.
    redTribe.addUsers(getUserNamesStartingWith(redTribeLetters));
    blueTribe.addUsers(getUserNamesStartingWith(blueTribeLetters));
    greenTribe.addUsers(getUserNamesStartingWith(greenTribeLetters));

    // Add a div displaying the tribes to the page.
    createTribeListDiv([redTribe, greenTribe, blueTribe]);
}

/**
 * Searches through the webpage's author links to find
 * users whose names start with the specified array of strings.
 *
 * @param {arr} - an array of strings that the returned list of usernames should
 *                start with.
 * @return {Array} - an array of all of the usernames on the page starting with
 *                   at least one of the specified strings.
 */
function getUserNamesStartingWith(strings) {

    // Ensure the passed argument is an array.
    if (!strings || !strings.length) {
        console.error("The getUserLinks function requires an array of strings as a parameter.");
        return;
    }
    
    // Ensure jQuery is available.
    if (!this.$) {
        console.error("The getUserLinks function requires jQuery.");
        return;
    }
    
    // Begin building up a list of usernames.
    var usernames = [];
    
    // Iterate through each of the passed strings.
    for (var i = 0; i < strings.length; i++) {
        
        // Ensure each element exists.
        var string = strings[i];
        if (!string)
            continue;
        
        // Iterate through all of the author links that start with the current string.
        $('.author[href*="user/' + string + '"]').each(function(index, element) {
            
            // Retrieve the username from the link's hypertext reference.
            var regex = /\/user\/(\w*)/;                // This regex captures eveything after '/user/', which will be the username.
            var matches = regex.exec(element.href);     // Execute the regular expression on the hypertext reference.
            
            // Ensure the username was found in the string (there's no reason why it shouldn't be, but just playing it safe).
            var username = matches[1];
            if (!username) 
                return true;                            // continue;
            
            // Ensure that the username is not already in the list of usernames.
            if (usernames.indexOf(username) != -1)
                return true;                            // continue;
            
            // Add the username to the list of usernames.
            usernames.push(username);
        });
    }
    
    // Return the list of usernames.
    return usernames;
}

/**
 * Creates an element to be displayed on the page containing a list of all of the 
 * users from each tribe that could be found on the page.
 *
 * @param {tribes} - an array of all of the tribes to include in the list.
 */
function createTribeListDiv(tribes) {
    
    // Create a div element to hold everything.
    var div = document.createElement('div');
    div.id = "tribeListDiv";
    div.style.background = "-webkit-linear-gradient(top,rgb(22,40,88),rgb(12,76,147))";
    div.style.borderColor = "rgb(209, 31, 45)";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "2px";
    div.style.borderRadius = "2px";
    div.style.width = "300px";
    div.style.maxHeight = "90%";
    div.style.height = "auto";
    div.style.padding = "10px";
    div.style.position = "fixed";
    div.style.right = "0";
    div.style.bottom = "0";
    div.style.zIndex = "999";
    div.opacity = "0.85";
    div.style.fontFamily = "Arial Black";
    div.style.textAlign = "center";
    div.style.overflowY = "scroll";
    
    // Add a close button to the div.
    var closeButton = document.createElement('label');
    closeButton.style.color = "#FFFFFF";
    closeButton.style.padding = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.innerHTML = "X";
    closeButton.style.position = "absolute";
    closeButton.style.right = "5px";
    closeButton.style.top = "5px";
    closeButton.style.borderRadius = "5px";
    closeButton.onmouseenter = function() {
        this.style.background = "red";
    }
    closeButton.onmouseleave = function() {
        this.style.background = "transparent";
    }
    closeButton.onclick = function() {
        $(div).animate({right: "-=400px", display: "hidden"});
    }
    div.appendChild(closeButton);
    
    // Add a header to the div.
    var divTitle = document.createElement('h1');
    divTitle.innerHTML = "TRIBES";
    divTitle.style.cursor = "default";
    div.appendChild(divTitle);
    
    // Create a div element to hold everything else.
    var contentDiv = document.createElement('div');
    div.appendChild(contentDiv);
    $(contentDiv).hide();
    
    // Display the content div when the user hovers over the main div.
    div.onmouseenter = function() {
        $(contentDiv).stop().slideDown();
    }
    
    // Hide the content div when the mouse leaves the main div.
    div.onmouseleave = function() {
        // Collapse all of the user divs.
        for (var i = 0; i < contentDiv.children.length; i++)
            $(contentDiv.children[i].lastChild).slideUp();
        
        $(contentDiv).stop().slideUp();
    }
    
    // Iterate through each of the tribes.
    for (var i = 0; i < tribes.length; i++) {
        
        // Ensure the element exists.
        var tribe = tribes[i];
        if (!tribe || !tribe.color || !tribe.name || !tribe.users)
            continue;
        
        // Create a div for the tribe.
        var tribeDiv = document.createElement('div');
        tribeDiv.style.backgroundColor = tribe.color;
        tribeDiv.style.borderRadius = "10px";
        tribeDiv.style.padding = "10px";
        tribeDiv.style.cursor = "pointer";
        
        // Have the tribe div toggle the user div when clicked.
        tribeDiv.onclick = function() {

            // Iterate through all of the tribe divs in the main div.
            for (var i = 0; i < contentDiv.children.length; i++) {

                // Check if the div is the clicked title's parent.
                var tribeDiv = contentDiv.children[i];
                if (tribeDiv == this)
                    // Open the user div.
                    $(tribeDiv.lastChild).slideToggle();

                // Otherwise, hide the div's user div.
                else
                    $(tribeDiv.lastChild).slideUp();
            }
        };
        
        // Add a div containing all of the users.
        var userDiv = document.createElement('div');
        tribeDiv.appendChild(userDiv);
        $(userDiv).hide();
        
        // Iterate through all of the users in the tribe.
        for (var j = 0; j < tribe.users.length; j++) {
            
            var user = tribe.users[j];
            
            // Create a new header for the user.
            var userHeader = document.createElement('h4');
            userHeader.style.borderRadius = "5px";
            userHeader.style.color = "#FFFFFF";
            userHeader.style.cursor = "pointer";
            
            // Set the header's content to the user's username.
            userHeader.innerHTML = user;
            
            // Navigate to the user's link when their name is clicked.
            userHeader.onclick = function() {
                document.location.href = "https://reddit.com/user/" + this.innerHTML;
            };
            
            // Change the style of the name when it is hovered over.
            userHeader.onmouseenter = (function() {
                var tribeColor = tribe.color;
                return function() {
                    this.style.color = tribeColor;
                    this.style.backgroundColor = "#FFFFFF";
                }
            })();
            
            // Change the style of the name back when the mouse leaves.
            userHeader.onmouseleave = function() {
                this.style.color = "#FFFFFF";
                this.style.backgroundColor = "transparent";
            }
            
            // Add the label to the user div.
            userDiv.appendChild(userHeader);
        };
        
        // Add a title element.
        var tribeTitle = document.createElement('h2');
        tribeTitle.innerHTML = tribe.name + " (" + tribe.users.length + ")";
        tribeTitle.style.color = "#FFFFFF";
        tribeTitle.style.cursor = "pointer";
        tribeTitle.margin = "5px";
        
        // Add the title in front of the userDiv.
        tribeDiv.insertBefore(tribeTitle, userDiv);

        // Append the tribe's div to the div.
        contentDiv.appendChild(tribeDiv);
    }
    
    // Add the created div to the page.
    $('body').append(div);
    $(div).hide().fadeIn();
}

/**
 * Constructs a new Tribe object which contains a color, a name,
 * and a list of all of the users in the tribe.
 *
 * @param {color} - a string representation of the color of the tribe.
 * @param {name} - the display name of the tribe.
 */
function Tribe(color, name) {
    this.color = color || "#000000";
    this.name = name || "Unknown Tribe";
    
    // Attempt to load the list of users from the local storage.
    this.users = localStorage.getItem(name)?
        // If the local storage contains a list of users, grab them.
        JSON.parse(localStorage.getItem(name)):
        // Otherwise, start fresh.
        [];
    
    /**
     * Adds a list of users to the tribe and saves the list of users to the
     * local storage of the browser. The users array object is stringified into a
     * JSON object and stored with the tribe name as the key.
     *
     * @param {usersToAdd} - an Array of usernames to add to the Tribe. Only
     *                       new names will be added.
     */
    this.addUsers = function(usersToAdd) {
        // Ensure the parameter is an array.
        if (!usersToAdd || !usersToAdd.length) {
            console.error("The Tribe's addUser method requires an array of usernames.");
            return;
        }
        
        // Iterate through all of the users in the array.
        for (var i = 0; i < usersToAdd.length; i++) {
            // Ensure the element is defined.
            var user = usersToAdd[i];
            if (!user)
                continue;
            
            // Ensure the user isn't already on the tribe.
            if (this.users.indexOf(user) != -1)
                continue;
            
            // Add the user to the list of users.
            this.users.push(user);
        }
        
        // Sort the users alphabetically.
        this.users = this.users.sort(function(a, b) {
            // Ignore case.
            return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
        })
        
        // Save the tribe to the local storage.
        localStorage.setItem(this.name, JSON.stringify(this.users));
    }
}