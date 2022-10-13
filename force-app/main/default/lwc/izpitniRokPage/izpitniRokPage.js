import { LightningElement, api, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getRecord } from 'lightning/uiRecordApi';
import STUDENT from '@salesforce/schema/Student__c';
import getStudenti from '@salesforce/apex/StudentController.getStudenti';
import getIzpitniRoki from '@salesforce/apex/StudentController.getIzpitniRoki';
import getPredmeti from '@salesforce/apex/StudentController.getPredmeti';
import getStudentiNaIzpitnemRoku from '@salesforce/apex/StudentController.getStudentiNaIzpitnemRoku';

const columns = [
    { label: 'Label', fieldName: 'Name' },
    { label: 'Ime', fieldName: 'Ime__c', type: 'text' },
    { label: 'Priimek', fieldName: 'Priimek__c', type: 'text' },
    { label: 'EMSO', fieldName: 'EMSO__c', type: 'number' },
    { label: 'Tip študija', fieldName: 'Tip_studija__c', type: 'text' },
];

export default class IzpitniRokPage extends LightningElement {
    studenti;
    columns = columns;
    optionsIzpitniRoki;
    izbranIzpitniRok;
    showTable = false;

    @wire(getStudenti)
    wiredStudenti({ error, data }) {
        if (data) {
            this.studenti = data;
            console.log("Studenti: ");
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    }

    @wire(getIzpitniRoki)
    wiredIzpitniRoki({ error, data }) { 
        if (data) {
            this.optionsIzpitniRoki = this.parseOptions(data);
            console.log("Izpitni roki: ");
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    }


    @wire(getPredmeti)
    wiredPredmeti({ error, data }) {
        if (data) {
            console.log("Predmeti: ");
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    }
    
    @wire(getStudentiNaIzpitnemRoku)
    handlePrikaz(event) {
        getStudentiNaIzpitnemRoku({ izpitniRokId: this.izbranIzpitniRok })
            .then(result => {
                let students = [];
                result.forEach(student => {
                    students.push(student.Student__r);
                });
                this.showTable = true;
                this.studenti = students;
                console.log(students);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleIzpitniRokChange(event) {
        this.izbranIzpitniRok = event.detail.value;
    }

    parseOptions(data) {
        let options = [];
        data.forEach(izpitniRok => {
            let label = izpitniRok.Datum__c + '  --->  ' + izpitniRok.Predmet__r.Name;
            options.push({ label: label, value: izpitniRok.Id });
        });
        return options;
    }
}