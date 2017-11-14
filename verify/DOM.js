"use strict";
/*global Element, NodeList: true*/

// Adds several helper methods to the built in DOM elements

Element.prototype.hasClass = function(className)
{
    var re = new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)");
    return re.test(this.className);
};

Element.prototype.addClass = function(className)
{
    if(!this.hasClass(className))
        this.className = [this.className, className].join(' ').trim();
};

Element.prototype.removeClass = function(className)
{
    while(this.hasClass(className))
    {
        this.className = this.className.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)"), " ").trim();
    }
};

Element.prototype.toggleClass = function(className)
{
    if(this.hasClass(className))
        this.removeClass(className);
    else
        this.addClass(className);
};

Element.prototype.getComputedStyle = function()
{
    return window.getComputedStyle(this);
};

Element.prototype.getXY = function()
{
    var y = 0, x = 0;
    var element = this;
    do
    {
        y += element.offsetTop || 0;
        x += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return [x, y];
};

Element.prototype.getX = function()
{
    return this.getXY()[0];
};

Element.prototype.getY = function()
{
    return this.getXY()[1];
};

Element.prototype.clear = function()
{
    while(this.firstChild)
    {
        this.removeChild(this.firstChild);
    }
};

NodeList.prototype.removeClass = function(className)
{
    for(var i=0;i<this.length;i++)
    {
        this[i].removeClass(className);
    }
};

NodeList.prototype.addClass = function(className)
{
    for(var i=0;i<this.length;i++)
    {
        this[i].addClass(className);
    }
};

NodeList.prototype.toArray = function()
{
    var a=[];
    for(var i=0;i<this.length;i++)
    {
        a.push(this[i]);
    }
    return a;
};
