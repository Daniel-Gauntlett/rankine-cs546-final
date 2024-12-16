(function ($) {
    let makeEventButton = $('#confirm_make_event');
    let makeEventForm = $('#make_event_form');
    let eventList = $('#event-list');
    let recurringCheckbox = $('#isRecurringCheckbox');
    let recurringDateBox = $('#recurDateBox');
    let approvalForm = $('#approve_form');
    let approvalCheckbox = $('#approval-checkbox');
    let eventInfo = $("#eventInfo");
    makeEventButton.submit(function (event) {
        event.preventDefault();
        makeEventButton.hide();
        eventList.hide();
        makeEventForm.show();
    })
    recurringCheckbox.click(function (event) {
        recurringDateBox.toggle();
    })
    approvalForm.submit(function (event) {
        event.preventDefault();
        let patch = {};
        if(approvalCheckbox.prop('checked')){
            patch.status = 2;
        } else {
            patch.status = 0;
        }
        let requestConfig = {
            method: 'PATCH',
            url: '/events/' + eventInfo.attr("class"),
            data: patch
        };
        $.ajax(requestConfig); 
    })

})(window.jQuery);