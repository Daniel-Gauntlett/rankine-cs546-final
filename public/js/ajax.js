(function ($) {
    let makeEventForm = $('#make_event_form');
    let recurringCheckbox = $('#isRecurringCheckbox');
    let recurringDateBox = $('#recurDateBox');
    let approvalForm = $('#approve_form');
    let approvalCheckbox = $('#approval-checkbox');
    let eventInfo = $("#eventInfo");
    let patchEventForm = $("#patch-event-form");
    let rsvp = $("#rsvp_form");
    let unrsvp = $("#unrsvp_form");
    let permissions = $("#permissions-form");
    let bookroom = $("#room_book_button");
    makeEventForm.submit(function (event) {
        event.preventDefault();
        let patch = {};
        patch.status = 1;
        patch.name = makeEventForm.find("input[name='name']").val();
        patch.description = makeEventForm.find("input[name='description']").val();
        patch.startDate = makeEventForm.find("input[name='startDate']").val();
        patch.endDate = makeEventForm.find("input[name='endDate']").val();
        patch.roomID = makeEventForm.attr("room");
        patch.roomPicture = makeEventForm.find("input[name='pictureURL']").val();
        patch.isRecurring = makeEventForm.find("input[name='isRecurring']").prop("checked");
        patch.recurUntil = patch.isRecurring ? makeEventForm.find("input[name='recurUntil']").val() : null;
        let requestConfig = {
            method: 'POST',
            url: '/events/',
            data: JSON.stringify(patch)
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
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
            url: '/events/event/' + eventInfo.attr("eventid"),
            data: JSON.stringify(patch)
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
        requestConfig = {
            method: 'POST',
            url: '/users/notification/' + eventInfo.attr("organizer"),
            data: notif
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        }); 
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
            url: '/events/event/' + eventInfo.attr("eventid"),
            data: JSON.stringify(patch)
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
    });

    rsvp.submit(function (event) {
        event.preventDefault();
        let newinfo = {};
        newinfo.user = eventInfo.attr("currentuser");
        let requestConfig = {
            method: 'PATCH',
            url: '/events/event/' + eventInfo.attr("eventid") + "/rsvp",
            data: JSON.stringify(newinfo)
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
    });

    unrsvp.submit(function (event) {
        event.preventDefault();
        let newinfo = {};
        newinfo.user = eventInfo.attr("currentuser");
        let requestConfig = {
            method: 'PATCH',
            url: '/events/event/' + eventInfo.attr("eventid") + "/unrsvp",
            data: JSON.stringify(newinfo)
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
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
            $.ajax(requestConfig).then(function (responseMessage) {
                if (responseMessage.redirect) {
                    window.location.href = responseMessage.redirect;
                }
            });
        }
    })

    /*function bindEventsToButton(link)  {
        link.on('submit', function (event) {
            event.preventDefault();
            let requestConfig = {
                method: 'GET',
                url: ('/events/create/' + bookroom.attr("roomid"))
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                console.log(responseMessage);
                if (responseMessage.redirect) {
                    window.location.href = responseMessage.redirect;
                }
            });
        })
    }*/

    bookroom.submit(function (event) {
        event.preventDefault();
        let requestConfig = {
            method: 'GET',
            url: ('/events/create/' + bookroom.attr("roomid"))
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            if (responseMessage.redirect) {
                window.location.href = responseMessage.redirect;
            }
        });
    })

})(window.jQuery);