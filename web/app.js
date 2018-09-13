"use strict";

const API = "/api/v1/event/"

class App {
    constructor() {
        console.log("yay");
        this.setupBindings();
        this.loadDates();
        this.dates = []
    }
    
    setupBindings() {
        this.datesEl = document.getElementById("dates");
        this.selectedDateEl = document.getElementById("selectedDate")
        this.eventsEl = document.getElementById("events");
    }
    
    loadDates() {
        fetch(API).then(resp => resp.json()).then(resp => {
            for (let x of resp) {
                let year = x.name;
                fetch(API+year).then(resp => resp.json()).then(resp => {
                    for (let x of resp) {
                        let month = x.name;
                        fetch(API+year+'/'+month).then(resp => resp.json()).then(resp => {
                            for (let x of resp) {
                                let day = x.name;
                                fetch(`${API}/${year}/${month}/${day}`).then(resp => resp.json()).then(resp => {
                                    let cameras = []
                                    for (let x of resp){
                                        cameras.push(x.name);
                                    }
                                    this.dates.push({
                                        year:year,
                                        month:month,
                                        day:day,
                                        cameras:cameras
                                    })
                                    this.showDates()
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    
    showDates() {
        this.datesEl.innerHTML = '';
        let frag = {}
        let dates = []
        for (let date of this.dates) {
            let cur_date = `${date.year}-${date.month}`
            if (!frag.hasOwnProperty(cur_date)){
                frag[cur_date] = []
                dates.push(cur_date)
                console.log("new date", cur_date)
            }
            frag[cur_date].push(`
                <a href=# onclick='app.showEvents("${date.year}/${date.month}/${date.day}", "${date.cameras}")'>${date.day}</a>
            `)
        }
        dates.sort()
        for (let date_key of dates) {
            console.log("new date section for", date_key)
            this.datesEl.innerHTML += `<h3>${date_key}</h3>`
            this.datesEl.innerHTML += frag[date_key].sort().join(" ");
        }
    }
    
    showEvents(date, cameras) {
        let frags = {}
        cameras = cameras.split(',')
        this.selectedDateEl.innerHTML = date.replace(/\//g, "-")
        this.eventsEl.innerHTML = '';
        for (let cam of cameras){
            frags[cam] = []
            fetch(`${API}/${date}/${cam}`).then(resp=>resp.json()).then(resp => {
                let events = []
                for (let x of resp){
                    let file = x.name;
                    let eventId = parseInt(file.split("-").pop().split(".")[0])
                    if (!(eventId in events)){
                        events[eventId] = {}
                    }
                    if (!("time" in events[eventId])){
                        events[eventId].time=file.split("_").pop().split("-")[0]
                    }
                    if (!file.endsWith(".jpg")){
                        events[eventId].video=file
                        continue;
                    }
                    events[eventId].img=file
                }
                for (let eventId in events){
                    let event = events[eventId];
                    if (event.img)
                    frags[cam].push(`
                      <a href="/rec/event/${date}/${cam}/${event.video}">
                        <img src="/rec/event/${date}/${cam}/${event.img}" style="display:block;width:100%;max-width:400px;margin-right:5px;margin-bottom:10px;">
                      </a>
                      <span>${event.time}</span>
                      <hr>
                    `)
                }
                this.eventsEl.innerHTML += `<div class=row><h3>${cam}</h3>${frags[cam].join("")}</div>`
            })
        }
        
    }
}
