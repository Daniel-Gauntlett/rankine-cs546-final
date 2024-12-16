(function ($) {
    let makeEventButton = $('#confirm_make_event');
    let makeEventForm = $('#make_event_form');
    let eventList = $('#event-list');
    let recurringCheckbox = $('#isRecurringCheckbox');
    let recurringDateBox = $('#recurDateBox');
    let approvalForm = $('#approve_form');
    let approvalCheckbox = $('#approval-checkbox');
    let eventInfo = $("#eventInfo");
    let patchEventForm = $("patch-event-form");
    let rsvp = $("rsvp_form");
    let unrsvp = $("unrsvp_form");
    let permissions = $("permissions-form");
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
        let notif = {};
        if(approvalCheckbox.prop('checked')){
            patch.status = 2;
            notif.notiftext = "Your event " + eventInfo.attr("eventname") + " was approved.";
        } else {
            patch.status = 0;
            notif.notiftext = "Your event " + eventInfo.attr("eventname") + " was denied.";
        }

        let requestConfig = {
            method: 'PATCH',
            url: '/events/' + eventInfo.attr("eventid"),
            data: JSON.stringify(patch)
        };
        $.ajax(requestConfig);
        requestConfig = {
            method: 'POST',
            url: '/users/notification/' + eventInfo.attr("organizer"),
            data: notif
        };
        $.ajax(requestConfig); 
    })

    patchEventForm.submit(function (event) {
        event.preventDefault();
        let patch = {};
        patch.status = 1;
        patch.name = patchEventForm.find("input[name='name']").val();
        patch.description = patchEventForm.find("input[name='description']").val();
        patch.startDate = patchEventForm.find("input[name='startDate']").val();
        patch.endDate = patchEventForm.find("input[name='endDate']").val();
        let requestConfig = {
            method: 'PATCH',
            url: '/events/' + eventInfo.attr("eventid"),
            data: JSON.stringify(patch)
        };
        $.ajax(requestConfig);
    });

    rsvp.submit(function (event) {
        event.preventDefault();
        let newinfo = {};
        newinfo.user = eventInfo.attr("currentuser");
        let requestConfig = {
            method: 'PATCH',
            url: '/events/' + eventInfo.attr("eventid") + "/rsvp",
            data: JSON.stringify(newinfo)
        };
        $.ajax(requestConfig);
    });

    unrsvp.submit(function (event) {
        event.preventDefault();
        let newinfo = {};
        newinfo.user = eventInfo.attr("currentuser");
        let requestConfig = {
            method: 'PATCH',
            url: '/events/' + eventInfo.attr("eventid") + "/unrsvp",
            data: JSON.stringify(newinfo)
        };
        $.ajax(requestConfig);
    });

    permissions.submit(function (event) {
        event.preventDefault();
        let userInfo = $("#userInfo");
        let dropdown = permissions.find("select[name='endDate']");
        let data = {};
        if(dropdown.val() >= 1){
            //data.user = 
            
        } else {
            data.permissions = 1;
            let requestConfig = {
                method: 'PATCH',
                url: '/users/' + eventInfo.attr("thisuser"),
                data: JSON.stringify(data)
            };
            $.ajax(requestConfig);
        }
    })

})(window.jQuery);