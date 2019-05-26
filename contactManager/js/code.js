/*

A note from Jonas:
    This is still a work in progress. I have over commented a bit, just to be on the safe side.
    All comments about things that need to be changed will begin and end with three asterisks ***.

*/

// *** Make sure to trim all input strings strings using .trim(). ***

var apiUrl  = "http://contactmanager.online/php";
var rootUrl = "http://contactmanager.online";
var dotPhp = ".php";

var userId = 0;
var login = "";
var jsonContacts = "";

// attempts to log in an existing user
function loginUser()
{
    userId = 0;
    login = "";

    // Get user input values.
    login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = apiUrl + '/loginUser' + dotPhp;
	
	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;
		
		// if userId is still at its initial value, the login has failed.
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "invalid login / password";
			return;
		}

		document.getElementById("loginName").value = "";
		document.getElementById("loginPassword").value = "";
		
		hideOrShow( "loggedInDiv", true);
		hideOrShow( "accessUIDiv", true);
		hideOrShow( "loginDiv", false);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// This function updates jsonContacts with user's contacts.
// The data in jsonContacts is NOT associative. It's indexed with integers.
// For example, this is the data for the first contact in alphabetical order:
// contact 0 (first in alphabetical order)
// _____________________________________________________________________________________   
// | last               | first              | phone              | id (auto increment) |
// | jsonContacts[0][0] | jsonContacts[0][1] | jsonContacts[0][2] | jsonContacts[0][3]  |
// |____________________|____________________|____________________|_____________________|
function getContacts()
{
	document.getElementById("getContactsResult").innerHTML = "";
	
	var last = "";
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + '}';
	var url = apiUrl + '/getContacts' + dotPhp;
	
	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		jsonContacts = JSON.parse( xhr.responseText );
	    
	    // These two lines are for testing and debugging only.
		var jsonStr = JSON.stringify(jsonContacts);
		document.getElementById("getContactsResult").innerHTML = jsonStr;
		
		//document.getElementById("getContactsResult").innerHTML = "Contacts retrieved.";
	}
	catch(err)
	{
		document.getElementById("getContactsResult").innerHTML = err.message;
	}
	
    // These two lines are for testing and debugging only.
    //var jsonStr = JSON.stringify(jsonContacts);
	//document.getElementById("getContactsResult").innerHTML = jsonStr;
}

// *** This will be rewritten. ***
function logoutUser()
{
	userId = 0;
	login = "";
	
	hideOrShow( "loggedInDiv", false);
	hideOrShow( "accessUIDiv", false);
	hideOrShow( "loginDiv", true);
}

// creates a new account
function addUser()
{
    // Get user input for new-account login and pasword.
    login = document.getElementById("loginText").value;
    var password = document.getElementById("passwordText").value;
    
    // *** We need to salt and hash the password before including it in the json ***
    
	document.getElementById("addUserResult").innerHTML = "";

	// login-data json that interfaces with php / api
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = apiUrl + '/addUser' + dotPhp;

	// http POST : Attempt to send json with new-account login and pasword data to server.	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addUserResult").innerHTML = "Your new account has been created.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addUserResult").innerHTML = err.message;
	}

}

// creates a new contact
function addContact()
{
    // Get user input information for new-contact.
	// *** We should validate all of these. For example email address should be in the     ***
	// *** form alphanumeric@alphanumeric.alphabetic, and first name should be alphabetic. ***
	var last = document.getElementById("lastText").value;
    var first = document.getElementById("firstText").value;
    var email = document.getElementById("emailText").value;
    var phone = document.getElementById("phoneText").value;
	var address = document.getElementById("addressText").value;
	
	document.getElementById("addContactResult").innerHTML = "";
	
	// contact-data json that interfaces with php / api
	var jsonPayload = '{"last" : "' + last + '","first" : "' + first + '", "email" : "' + email + '", "phone" : ' + phone + ', "address" : "' + address + '", "userId" : ' + userId + '}';
	var url = apiUrl + '/addContact' + dotPhp;

	// http POST : Attempt to send json with new-contact data to server.		
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addContactResult").innerHTML = "Your new contact has been added.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

// This function searches for contacts with matches based on an input string.
// It updates jsonContacts with the contacts with matching "first" rows.
// *** This should be updated to use an argument for the search string. ***
function searchContactsByFirst()
{
    document.getElementById("searchContactsByFirstResult").innerHTML = "";
	
    var firstKey = document.getElementById("firstSearchText").value;
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + ', "first" : "' + firstKey + '"}';
	var url = apiUrl + '/searchContactsByFirst' + dotPhp;
	
	// http POST : Attempt to send json with id and key infomation to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		jsonContacts = JSON.parse( xhr.responseText );
	    
	    // These two lines are for testing and debugging only.
		//var jsonStr = JSON.stringify(jsonContacts);
		//document.getElementById("getContactsResult").innerHTML = jsonStr;
		
		document.getElementById("searchContactsByFirstResult").innerHTML = "Matching contact(s) retrieved.";
	}
	catch(err)
	{
		document.getElementById("searchContactsByFirstResult").innerHTML = err.message;
	}
	
    // These two lines are for testing and debugging only.
    //var jsonStr = JSON.stringify(jsonContacts);
	//document.getElementById("contactsList").innerHTML = jsonStr;
}

// This function searches for contacts with matches based on an input string.
// It updates jsonContacts with the contacts with matching "last" rows.
// *** This should be updated to use an argument for the search string. ***
function searchContactsByLast()
{
    document.getElementById("searchContactsByLastResult").innerHTML = "";
	
    var lastKey = document.getElementById("lastSearchText").value;
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + ', "last" : "' + lastKey + '"}';
	var url = apiUrl + '/searchContactsByLast' + dotPhp;
	
	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		jsonContacts = JSON.parse( xhr.responseText );
	    
	    // These two lines are for testing and debugging only.
		//var jsonStr = JSON.stringify(jsonContacts);
		//document.getElementById("getContactsResult").innerHTML = jsonStr;
		
		document.getElementById("searchContactsResult").innerHTML = "Matching contact(s) retrieved.";
	}
	catch(err)
	{
		document.getElementById("searchContactsByLastResult").innerHTML = err.message;
	}
	
    // These two lines are for testing and debugging only.
    //var jsonStr = JSON.stringify(jsonContacts);
	//document.getElementById("contactsList").innerHTML = jsonStr;
}

// Delete contact with corresponding id.
function deleteContact(id)
{
    document.getElementById("deleteContactResult").innerHTML = "";
	
	// contact-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + id + '}';
	var url = apiUrl + '/deleteContact' + dotPhp;

	// http POST : Attempt to send json with contact-id data to server.		
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("deleteContactResult").innerHTML = "Your contact has been deleted.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteContactResult").innerHTML = err.message;
	}
}

// *** This will be rewritten. ***
function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}
	
	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

