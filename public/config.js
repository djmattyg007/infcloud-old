/*
InfCloud - the open source CalDAV/CardDAV Web Client
Copyright (C) 2011-2015
    Jan Mate <jan.mate@inf-it.com>
    Andrej Lezo <andrej.lezo@inf-it.com>
    Matej Mihalik <matej.mihalik@inf-it.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


// NOTE: see readme.txt before you start to configure this client!

// globalAccountSettings must be an array (can be undefined if you use globalNetworkCheckSettings or globalNetworkAccountSettings)
//  the href value is a "principal URL" - the last character in href must be '/'
//    principal URL != collection URL -> the client automatically detects collections for each principal URL
//    PROPER principal URL looks like:
//      https://server.com:8443/principals/users/USER/
//      https://server.com:8443/caldav.php/USER/
//    INVALID principal URL looks like:
//      https://server.com:8443/principals/users/USER/collection/	<- url to collection
//      https://server.com:8443/caldav.php/USER/collection/		<- url to collection
//      https://server.com:8443/principals/users/USER			<- missing '/'
//      https://server.com:8443/caldav.php/USER				<- missing '/'
// the hrefLabel sets the server name in the resource header - useful if you want to see custom resource header above the collections; you can use the following variables: %H = full hostname (including the port number), %h = full hostname (without the port number), %D = full domain name, %d = only the first and second level domain, %P = principal name, %p = principal name without the @domain.com part (if present), %U = logged user name, %u = logged user name without the @domain.com part (if present); if undefined, empty or or null then '%d/%p [%u]' is used
// the forceReadOnly sets the resource or list of collections as "read-only" - if true then the whole resource will be "read-only"; if an array of URL encoded collections or regexes (for example: ['/caldav.php/user/calendar/', '/caldav.php/user%40domain.com/calendar/', new RegExp('^/caldav.php/user/calendar[0-9]/$', 'i')]) then specified collections will be marked as "read-only"; if null (default), unset or unknown then server detected privileges are used
// the timeOut sets the timeout for jQuery .ajax call (in miliseconds)
// the lockTimeOut sets the LOCK Timeout value if resource locking is used (in miliseconds)
// the settingsAccount sets the account where client properties are saved during logout and resource/collection synchronisation (note: set it to true only for ONE account)
// the checkContentType enables content-type checking for server response (only objects with proper content-type are inserted into interface) - if you cannot see data in the interface you may try to disable it (useful if your server return wrong value in "propstat/prop/getcontenttype"); if undefined content-type checking is enabled
// the delegation allows user to load delegated (shared) resources - if true (default) then delegation is enabled and the interface allows you to select which delegated resources/collections you want to load; if false then delegation is disabled
// the ignoreAlarms defines an array of calendars with disabled alarm functionality - if true then alarm functionality is disabled for all collections; if false (default) then alarm functionality is enabled for all collections; if an array of URL encoded collections or regexes (for example: ['/caldav.php/user/calendar/', '/caldav.php/user%40domain.com/calendar/', new RegExp('^/caldav.php/user/calendar[0-9]/$', 'i')] then alarm functionality is disabled for all specified collections
// the backgroundCalendars defines an array of background calendars - if there is at least one event defined for the given day in a background calendar, the background color for that day will be pink/light-red; to use this feature define an array of URL encoded collections or regexes (for example: ['/caldav.php/user/calendar/', '/caldav.php/user%40domain.com/calendar/', new RegExp('^/caldav.php/user/calendar[0-9]/$', 'i')])
// special options not present in the default config (use only if you know what are you doing!):
//  the crossDomain sets jQuery ajax crossDomain value (use only if you know what are you doing!) - by default null = autodetect /detected setting is shown in the console/
//  the withCredentials sets jQuery's ajax withCredentials value for cross domain queries (use only if you know what are you doing!); note: if true, Access-Control-Allow-Origin "*" is not allowed
//var globalAccountSettings=[{href: 'https://server1.com:8443/caldav.php/USERNAME1/', hrefLabel: null, forceReadOnly: null, settingsAccount: true, checkContentType: true, userAuth: {userName: 'USERNAME1', userPassword: 'PASSWORD1'}, timeOut: 90000, lockTimeOut: 10000, delegation: true, ignoreAlarms: false, backgroundCalendars: []}, {href: 'https://server1.com:8443/principals/users/USERNAME2/', hrefLabel: null, forceReadOnly: null, settingsAccount: false, checkContentType: true, userAuth: {userName: 'USERNAME2', userPassword: 'PASSWORD2'}, timeOut: 90000, lockTimeOut: 10000, delegation: true, ignoreAlarms: false, backgroundCalendars: []}];

// if set, the client authenticates against the href URL (the last character in href must be '/') and if the authentication is successful it appends the USER + '/' to end of href and sets the userAuth: {userName: USER, userPassword: PASSWORD}
// then the client uses the modified globalNetworkCheckSettings in the same way as the globalAccountSettings
// this option ivokes a login screen and disallows access until successfull authentication
// the additionalResources array can contain additional resources (shared resources accessible by all users), for example: additionalResources: ['company','customers'] ... href values for these resources are created in the same way as described above for the USER
// see globalAccountSettings (above) comments for more information
// Lion server example (http + https setup; see misc/readme_lion.txt for server setup):
//var globalNetworkCheckSettings={href: 'http://lion.server.com:8008/principals/users/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, backgroundCalendars: [], ignoreAlarms: false}
//var globalNetworkCheckSettings={href: 'https://lion.server.com:8443/principals/users/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, backgroundCalendars: [], ignoreAlarms: false}
// DAViCal example (for cross-domain setup see misc/config_davical.txt):
//var globalNetworkCheckSettings={href: 'http://davical.server.com:8080/caldav.php/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, backgroundCalendars: [], ignoreAlarms: false}
// Davical example (client installed into Davical subdirectory - works out of the box, no additional setup required):
var globalNetworkCheckSettings={href: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+location.pathname.replace(RegExp('/+[^/]+/*(index\.html)?$'),'')+'/caldav.php/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, checkContentType: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, ignoreAlarms: false, backgroundCalendars: []}

// if set, the configuration is loaded from the network (using HTTP basic auth) - the returned configuration XML settings are added
//  to globalAccountSettings ... it is possible to combine this option with the globalAccountSettings although it is not recommended
// this option invokes a login screen and disallows access until the client gets correct XML configuration file from the server
// the timeOut sets the timeout for jQuery .ajax call (in miliseconds)
//var globalNetworkAccountSettings={href: 'https://www.config-server.com/auth.php', timeOut: 30000};
// default configuration if the auth module is located in the currect subdirectory
//var globalNetworkAccountSettings={href: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '')+location.pathname.replace(RegExp('index\.html$'),'')+'auth.php', timeOut: 30000};

// use jQuery .ajax() auth or custom header for HTTP basic auth (default)
// set this option to true if your server uses digest auth (note: you may experience auth popups on some browsers)
//  if undefined (or empty), custom header for HTTP basic auth is used
//var globalUseJqueryAuth=false;

// default interface language - see localization.js
//  supported languages (note: this option is case sensitive):
//   cs_CZ (Čeština [Czech])
//   da_DK (Dansk [Danish]; thanks Niels Bo Andersen)
//   de_DE (Deutsch [German]; thanks Marten Gajda and Thomas Scheel)
//   en_US (English [English/US])
//   es_ES (Español [Spanish]; thanks Damián Vila)
//   fr_FR (Français [French]; thanks John Fischer)
//   it_IT (Italiano [Italian]; thanks Luca Ferrario)
//   ja_JP (日本語 [Japan]; thanks Muimu Nakayama)
//   hu_HU (Magyar [Hungarian])
//   nl_NL (Nederlands [Dutch]; thanks Johan Vromans)
//   sk_SK (Slovenčina [Slovak])
//   tr_TR (Türkçe [Turkish]; thanks Selcuk Pultar)
//   ru_RU (Русский [Russian]; thanks Александр Симонов)
//   uk_UA (Українська [Ukrainian]; thanks Serge Yakimchuck)
var globalInterfaceLanguage='en_US';

// if defined and not empty then only languages listed here are shown at the login screen (for example: ['en_US', 'sk_SK']),
//  otherwise (default) all languages are shown
//  values in the array must refer to an existing localization defined in the common.js (see the option above)
var globalInterfaceCustomLanguages=[];

// JavaScript localeCompare() or custom alphabet for data sorting
//  custom alphabet is used by default because the JavaScript localeCompare() not support collation and often returns "wrong" result
//var globalSortAlphabet=null;	// use localeCompare()
var globalSortAlphabet=' 0123456789AÀÁÂÄÆÃÅĀBCÇĆČDĎEÈÉÊËĒĖĘĚFGĞHIÌÍÎİÏĪĮJKLŁĹĽMNŃÑŇOÒÓÔÖŐŒØÕŌPQRŔŘSŚŠȘșŞşẞTŤȚțŢţUÙÚÛÜŰŮŪVWXYÝŸZŹŻŽaàáâäæãåābcçćčdďeèéêëēėęěfgğhiìíîïīįıjklłĺľmnńñňoòóôöőœøõōpqrŕřsśšßtťuùúûüűůūvwxyýÿzźżžАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЮЯЬабвгґдеєжзиіїйклмнопрстуфхцчшщюяь';	// use custom alphabet sorting (note: the first character is "space")
// search functionality character equivalence (transformation to ASCII: key = regex text, value = result character)
var globalSearchTransformAlphabet={'[ÀàÁáÂâÄäÆæÃãÅåĀā]': 'a', '[ÇçĆćČč]': 'c', '[Ďď]': 'd', '[ÈèÉéÊêËëĒēĖėĘęĚě]': 'e', '[Ğğ]': 'g', '[ÌìÍíÎîİıÏïĪīĮį]': 'i', '[ŁłĹĺĽľ]': 'l', '[ŃńÑñŇň]': 'n', '[ÒòÓóÔôÖöŐőŒœØøÕõŌō]': 'o', '[ŔŕŘř]': 'r', '[ŚśŠšȘșŞşẞß]': 's', '[ŤťȚțŢţ]': 't', '[ÙùÚúÛûÜüŰűŮůŪū]': 'u', '[ÝýŸÿ]': 'y', '[ŹźŻżŽž]': 'z'};

// update notification will be shown only to users with login names defined in this array (for example: ['admin', 'peter'])
//  if undefined (or empty), update notifications will be shown to all users
var globalNewVersionNotifyUsers=[];

// set the datepicker format (see http://api.jqueryui.com/datepicker/#utility-formatDate for valid values)
// note: date format is now predefined for each localization - use this option only if you want to use custom date format instead of the predefined one
//var globalDatepickerFormat='yy.mm.dd';

// set the datepicker first day of the week: Sunday is 0, Monday is 1, etc.
var globalDatepickerFirstDayOfWeek=1;

// editor hide information message (success, error) after X miliseconds
var globalHideInfoMessageAfter=1800;

// editor fade in/out animation duration (editing or saving)
var globalEditorFadeAnimation=666;

// if more than one resource (server account) is configured, sort resources alphabetically?
var globalResourceAlphabetSorting=true;

// asynchronously sync resources/collections on background every X miliseconds
var globalSyncResourcesInterval=120000;

// enable background sync even if browser window has no focus (if false, sync is performed only if browser window/tab is focused)
//  if undefined or not false, background sync is enabled
var globalBackgroundSync=true;

// enable keyboard navigation?
//  if undefined or not false, keyboard navigation is enabled
var globalEnableKbNavigation=true;

// where to store user settings such as: active view, enabled/selected collections, ... (we store them into DAV property on the server)
// note: not all servers support storing DAV properties (some servers support only subset /or none/ of these URLs)
//  if 'principal-URL', '', null or undefined (default) - settings are stored to principal-URL
//  if 'addressbook-home-set' - settings are are stored to addressbook-home-set
//  if 'calendar-home-set' - settings are stored to calendar-home-set
//var globalSettingsType='';

// settings such as enabled/selected collections are stored on the server (see the previous option) in form of full URL (e.g.: http://user@server:port/principal/collection/),
//  but even if this approach is "correct" (you can use the same principal URL with multiple different logins, ...) it causes a problem if your server is accessible
//  from multiple URLs (e.g. http://server/ and https://server/). If you want to store only the "principal/collection" part of the URL (instead of full URL) then enable this option
//var globalCrossServerSettingsURL=false;


// ******* CalDAV (CalDavZAP) related settings ******* //

// number of months pre-loaded from past and future in advance (if null then date range synchronization is disabled)
// note: interval synchronization is used only if your server supports sync-collection REPORT (e.g. DAViCal)
// note: if you experience problems with data loading and your server has no time-range filtering support set both variables to null
var globalEventStartPastLimit=3;
var globalEventStartFutureLimit=3;
var globalTodoPastLimit=1;

// default fullcalendar view option (use 'month', 'multiWeek', 'agendaWeek' or 'agendaDay')
// note: we use custom and enhanced version of fullcalendar!
var globalActiveView='multiWeek';

// open new event form on 'single' or 'double' click (if undefined or not 'double', then 'single' is used)
var globalOpenFormMode='double';

// set calendar to be selected by default after login (URL encoded path to the calendar, for example: 'USER/calendar/')
// if empty or undefined the first available calendar is selected automatically
//var globalCalendarSelected='';

// set todo calendar to be selected by default after login (URL encoded path to the todo calendar, for example: 'USER/todoCalendar/')
// if empty or undefined the first available todo calendar is selected automatically
//var globalTodoCalendarSelected='';

// calendar collections stored in this array are loaded after login (if empty then all collections are loaded)
// note: settings stored on server (see settingsAccount) overwrites this variable
var globalLoadedCalendarCollections=[];

// todo calendar collections stored in this array are loaded after login  (if empty then all collections are loaded)
// note: settings stored on server (see settingsAccount) overwrites this variable
var globalLoadedTodoCollections=[];

// calendar collections stored in this array are checked (visible in the interface) by default after login
// note: settings stored on server (see settingsAccount) overwrites this variable
var globalActiveCalendarCollections=[];

// todo calendars collections stored in this array are checked (visible in the interface) by default after login
// note: settings stored on server (see settingsAccount) overwrites this variable
var globalActiveTodoCollections=[];

// which filters in todo list are selected (filterAction, filterProgress, filterCompleted, filterCanceled)
// note: filterProgress and filterCanceled are available only if globalAppleRemindersMode is disabled
// note: settings stored on server (see settingsAccount) overwrites this variable
var globalTodoListFilterSelected=['filterAction', 'filterProgress'];

// set business hours with 0.5 hour precision - non-business hours will be faded out in the calendar interface
// if both variables have the same value no fade out occurs
var globalCalendarStartOfBusiness=8;
var globalCalendarEndOfBusiness=17;

// set default duration (in minutes) for newly created events.
// If undefined or null, globalCalendarEndOfBusiness value will be taken as a default end time instead
var globalDefaultEventDuration=120;

// use 12 hours format (AM/PM) for displaying time?
// note: time format is now predefined for each localization - use this option only if you want to use custom time format instead of the predefined one
//var globalAMPMFormat=false;

// format time information of events shown in month and multiweek views
// if undefined or null, default value will be used
// if defined as empty string, no time information will be shown
// see http://arshaw.com/fullcalendar/docs/utilities/formatDate/ for exact formating rules
//var globalTimeFormatBasic='';

// format time information of events shown in agenda (week and day) views
// if undefined or null, default value will be used
// if defined as empty string, no time information will be shown
// see http://arshaw.com/fullcalendar/docs/utilities/formatDate/ for exact formating rules
//var globalTimeFormatAgenda='';

// display hidden (unchecked calendar) events with certain transparency (true) or remove them from the interface completely (false)
var globalDisplayHiddenEvents=false;

// turn on timezone support for "time events", if disabled local time is used
var globalTimeZoneSupport=true;

// set the calendar default timezone
// see timezones.js or use the following command to get the list of supported timezones defined in timezones.js:
// grep "'[^']\+': {" timezones.js | sed -Ee "s#(\s*'|':\s*\{)##g"
var globalTimeZone='Europe/Berlin';

// array of enabled timezones, for example: ['America/New_York', 'Europe/Berlin'] (see the comment for the previous configuration option)
// note: if there is at least one event/todo with a certain timezone defined, that timezone is enabled automatically
var globalTimeZonesEnabled=[];

// enhance event timezone information using official IANA source (recommended)
var globalRewriteTimezoneComponent=true;

// remove non standard timezone names from events and todos on save action (e.g. /freeassociation.sourceforge.net/Tzfile/Europe/Vienna)
var globalRemoveUnknownTimezone=false;

// show alarms of hidden calendars
// if this option is enabled and you uncheck a calendar in the calendar list, alarm will be temporary disabled for this calendar
var globalShowHiddenAlarms=false;

// ignore alarms for completed or cancelled todos
var globalIgnoreCompletedOrCancelledAlarms=true;

// Mozilla automatically treats custom repeating event calculation as if the start day of the week is Monday,
// despite what day is chosen in the settings. Set this variable to true to use the same approach, ensuring
// compatible event rendering in special cases
var globalMozillaSupport=false;

// which namespace is used for storing the "calendar-color" property by the client
//  if true undefined (or empty) we use the "http://apple.com/ns/ical/" namespace (Apple compatible)
//  if false then it is not possible to edit the calendar color in the interface
//var globalCalendarColorPropertyXmlns=true;

// set what days of the week are considered weekend days; non-weekend days are automatically considered to be business days
// Sunday is 0, Monday is 1, etc.
var globalWeekendDays=[0, 6];

// STRONGLY recommended if you use any Apple clients for todos (has no effect on events).
// Accepted values are currently 'iOS6', 'iOS7', true (support of the latest iOS version - 'iOS7') and false.
// If enabled:
//  - RFC todo support is SEVERELY limited and the client mimics the behaviour of Apple Reminders.app (to ensure maximum compatibility)
//  - when a single instance of repeating todo is edited, it becomes an autonomous non-repeating todo with NO relation to the original repeating todo
//  - capabilities of repeating todos are limited - only the first instance is ever visible
//  - support for todo DTSTART attribute is disabled
//  - support for todo STATUS attribute other than COMPLETED and NEEDS-ACTION is disabled
//  - [iOS6 only] support for LOCATION and URL attributes is disabled
var globalAppleRemindersMode=true;

// NOTE: subsribed calendars are NOT "shared" calendars ... for "shared" calendars see the delegation option in globalAccountSettings, globalNetworkCheckSettings and globalNetworkAccountSettings
// array of subscribed (read-only) calendars; each calendar is identified by an url address (for example: http://something.com/calendar.ics)
//var globalSubscribedCalendars={hrefLabel: 'Subscribed', calendars: [{displayName: 'Subscribed Calendar', href: 'http://something.com/calendar.ics', userAuth: {userName: '', userPassword: ''}, ignoreAlarm: true, color: '#ff0000', typeList: ['vevent','vtodo']}]};


// ******* CardDAV (CardDavMATE) related settings ******* //

// compatibility settings
//  anniversaryOutputFormat:
//  different clients use different (and incompatible) approach to store anniversary date in vCard
//   Apple stores this attribute as 'itemX.X-ABDATE;TYPE=pref:2000-01-01\r\nitemX.X-ABLabel:_$!<Anniversary>!$_\r\n'
//   other clients store this attribute as 'X-ANNIVERSARY:2000-01-01\r\n'
//  choose 'apple' or 'other' (lower case) for your 3rd party client compatibility (you can chose both: ['apple', 'other'] but it can cause many problems in the future, for example: duplicate anniversary dates, invalid/old anniversary date in your clients, and many others ...)
var globalCompatibility={anniversaryOutputFormat: ['apple']};

// set the collection sorting and displaying - set an array of values/variables for each option (see the NOTE below)
//  possible variables in values: last, middle, first, prefix, suffix
// NOTE: in globalCollectionDisplay and globalContactStoreFN you also need to define a separator in the array values
// for example:
//   the default value is globalCollectionDisplay=['last',' middle',' first'] (space in the second and third elements)
// if you want comma separator between last, middle and firstname in the interface you should use:
//   globalCollectionDisplay=['last',', middle',', first'] (comma and space in the second and third elements)
var globalCollectionSort=['last','middle','first'];		// do not use separators here (use only an array of variables)
var globalCollectionDisplay=['last',' middle',' first'];
var globalContactStoreFN=['prefix',' last',' middle',' first',' suffix'];

// display "company name" (ORG attribute) for company contacts (true) or use N/FN instead
//  if undefined or not false, it is enabled by default
var globalCollectionDisplayOrg=true;

// group contacts by company name and department (with "Company [Department]" header) instead of simple alphabetical sorting
//  with one character header
//  if undefined or not true, alphabetical sorting with one character header is used
var globalGroupContactsByCompanies=false;

// set the URI handlers for EMAIL, TEL, URL and X-SOCIALPROFILE attributes (set to null or comment out to disable)
var globalUriHandlerTel='tel:';	// if 'tel' is not supported by system/browser, you can use 'callto' or 'skype'
var globalUriHandlerEmail='mailto:';
var globalUriHandlerUrl='http://';	// the value is used only if no URI handler is defined in the URL
var globalUriHandlerProfile={'twitter': 'http://twitter.com/%u', 'facebook': 'http://www.facebook.com/%u', 'flickr': 'http://www.flickr.com/photos/%u', 'linkedin': 'http://www.linkedin.com/in/%u', 'myspace': 'http://www.myspace.com/%u', 'sinaweibo': 'http://weibo.com/n/%u'};

// default country for new address fields (must be defined in addressTypes variable - see common.js)
var globalDefaultAddressCountry='us';
// if there is no X-ABADR defined for the ADR attribute and the country name not matches any country name defined in the common.js the globalDefaultAddressCountry is used unless you define alternativne country names here
//  the country must refer to an existing country defined in the common.js and the regex is any regex string which matches the given country (note: regex match is case insensitive)
var globalAddressCountryEquivalence=[{country: 'de', regex: '^\\W*Deutschland\\W*$'}, {country: 'sk', regex: '^\\W*Slovensko\\W*$'}];
// countries listed here are shown at the top of the ADR country list (for example: ['de','sk'])
//  values in the array must refer to an existing country defined in the common.js
var globalAddressCountryFavorites=[];

// set addressbook to be selected by default after login (URL encoded path to the addressbook, for example: 'USER/addressbook/')
// if empty or undefined the first available addressbook is selected automatically
//var globalAddressbookSelected='';

// addressbooks stored in this array are checked by default after login (settings stored on server /see settingsAccount/ overwrites this variable)
var globalActiveAddressbookCollections=[];

// addressbooks stored in this array are loaded after login (settings stored on server /see settingsAccount/ overwrites this variable)
var globalLoadedAddressbookCollections=[];

// which namespace is used for storing the "addressbook-color" property by the client
//  if true undefined (or empty) we use the "http://inf-it.com/ns/ab/" namespace
//  if false then saving of "addressbook-color" property is disabled and addressbook colors in the interface are generated automatically
//var globalAddrColorPropertyXmlns=true;
