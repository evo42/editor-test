Aloha.ready( function() { 
  app.editor.aloha(Aloha, Aloha.jQuery, Aloha.jQuery("#report-container"));
  app.editor.init();
});

var app = {

  insertNodeAtCursor: function(node) {
    var range, html;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
  }

};


// ============================================
// Smooth Scrolling
// ============================================

app.nav = {};

app.nav.smoothLinks = (function(internalLinks){

  internalLinks.on("click", scrollSmoothlyTo);

  function scrollSmoothlyTo(e){
    e.preventDefault();
    $('html,body').animate({
      scrollTop:$(this.hash).offset().top
    }, 500);
  }

  return internalLinks;
 
})($('a[href^="#"]'));


// ============================================
// Editor
// ============================================

app.editor = {

  init: function() {
    this.tracker.init(); //trigger ice
    this.aloha.init(); //trigger Aloha
  }

};

// aloha* ==============================
// * doesn't trigger until Aloha.ready triggers

app.editor.aloha = function (A, $$, content) {

  if(content.length < 1) return {};

  var blocks = content.find('.uneditable');

  function enable() {
    content.aloha();
    blocks.alohaBlock();
    console.log("Aloha Enabled.");
  }

  function disable() {
    content.mahalo();
    blocks.mahaloBlock();
  }

  app.editor.aloha = {
    init    : enable,
    enable  : enable,
    disable : disable,
    blocks  : blocks,
    content : content
  }
 
};

// editor variables ===================

app.editor.variables = (function (btn, dropdown) {

  function insertEditorVariable(variable, value) {
    var node = $("<span />", { "class" : "uneditable", "text": variable, "data-value": value});
    app.insertNodeAtCursor(node[0]);
    $('.uneditable').mahaloBlock();
    $('.uneditable').alohaBlock();

  }

  btn.on("click", triggerInsert);

  function triggerInsert(e) { 
    e.preventDefault();

    var $this = $(dropdown),
    $varname  = $.trim($this.val()),
    $varvalue = $.trim($this.find('option[value="' + $varname + '"]').data('value'))

    if($varname){
      insertEditorVariable($varname, $varvalue);
    }
  }

  return {
    insert : insertEditorVariable
  }

})($('a[data-insert="variable"]'), $('#editorvars'));

// editor track changes ===============

app.editor.tracker = (function ($report, $controls) {
 
  var trackerOn = false,
      toggle = $controls.filter('[data-ice="toggle"]'),
  
  tracker = new ice.InlineChangeEditor({
    element: $report[0],
    handleEvents: true,
    currentUser: { id: 1, name: 'Example User' }
  }),

  controlActions = {
    "toggle"      : toggleTracker,
    "accept"      : tracker.acceptChange,
    "reject"      : tracker.rejectChange,
    "accept-all"  : tracker.acceptAll,
    "reject-all"  : tracker.rejectAll
  };

  $controls.on("click", handleTrackerAction);

  function handleTrackerAction(e) {
    var $this = $(e.currentTarget),
        action  = $this.data("ice");

    controlActions[action].call(tracker); 
  }

  function toggleTracker() {
    if(trackerOn){
      toggle.text("Turn Track Changes On");
      tracker.disableChangeTracking();
    } else { 
      toggle.text("Turn Track Changes Off");
      tracker.enableChangeTracking();
    }
    trackerOn = (trackerOn) ? false : true;
  }

  function init() {
    tracker.startTracking();
    toggleTracker();
    console.log("tracker started.");
  }
  
  return {
    tracker : tracker,
    init: init
  }

})($('#report-container'), $('a[data-ice]'));




