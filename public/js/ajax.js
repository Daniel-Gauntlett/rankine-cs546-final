(function ($) {
    let makeEventButton = $('#make_event_button');
    let makeEventForm = $('#make_event_form');
    let eventList = $('#event-list');
    let recurringCheckbox = $('isRecurringCheckbox');
    let recurringDateBox = $('recurDateBox');
    makeEventButton.submit(function (event) {
        event.preventDefault();
        makeEventButton.hide();
        eventList.hide();
        makeEventForm.show();
    })
    recurringCheckbox.click(function (event) {
        recurringDateBox.toggle();
    })
    

})(window.jQuery);