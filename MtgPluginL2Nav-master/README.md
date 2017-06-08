# MtgPluginL2Nav

This will auto align navigation element with class .topNav. This will also ensure proper
mobile toggle by default; however, can for mobile toggle at break point by setting 
data attribute on the container. 


Classes for use: 

.set-sticky: 

	Adding this class will ensure the navigation will stick in place.  Will not stick if
	is mobile.
	

Data attributes for use: 

data-auto-addition:

	values - top/bottom. 
	Top will add the L1 items to the top of the mobile display
	Bottom will add the l1 items to after the last parent li in the L2 menu

data-logo: 

	This will tell the L2 which logo to use on mobile display option

data-mobile-toggle:

	This will allow you to set where the mobile toggle will be triggered

data-max-width:

	This will allow you to set a max width on the container