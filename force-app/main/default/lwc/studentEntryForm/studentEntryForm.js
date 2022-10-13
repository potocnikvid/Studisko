import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import STUDENT from '@salesforce/schema/Student__c';
import IME from '@salesforce/schema/Student__c.Ime__c';
import PRIIMEK from '@salesforce/schema/Student__c.Priimek__c';
import TIP_STUDIJA from '@salesforce/schema/Student__c.Tip_studija__c';
import EMSO from '@salesforce/schema/Student__c.EMSO__c';
import { createRecord } from 'lightning/uiRecordApi';

export default class StudentEntryForm extends LightningElement {
    objectApiName = STUDENT;
    showPlacnik = false;
    studentId = undefined;
    ime = undefined;
    priimek = undefined;
    emso = undefined;
    tipStudija = 'Redni';

    optionsTipStudija = [
        { label: 'Redni', value: 'Redni' },
        { label: 'Izredni', value: 'Izredni' },
    ];

    handleError(event){
        console.log(event.detail.id);
        const toastEvent = new ShowToastEvent({
            title:"Študent ni bil dodan",
            message: JSON.stringify(event.detail),
            variant:"error"
        });
        this.dispatchEvent(toastEvent);
    }
    handleSuccess(event){
        console.log(event.detail.id);
        const toastEvent = new ShowToastEvent({
            title:"Študent uspešno dodan",
            message:"Študent ID: " + event.detail.id,
            variant:"success"
        });
        this.dispatchEvent(toastEvent);
    }
    handleImeChange(event) {
        this.ime = event.target.value;
    }
    handlePriimekChange(event) {
        this.priimek = event.target.value;
    }
    handleEmsoChange(event) {
        this.emso = event.target.value;
    }
    handleTipChange(event) {
        this.value = event.detail.value;
        if(this.value == 'Izredni'){
            this.tipStudija = 'Izredni';
            this.showPlacnik = true;
        } else {
            this.tipStudija = 'Redni';
            this.showPlacnik = false;
        }
    }
    createAccount() {
        const fields = {};
        fields[IME.fieldApiName] = this.ime;
        fields[PRIIMEK.fieldApiName] = this.priimek;
        fields[EMSO.fieldApiName] = this.emso;
        fields[TIP_STUDIJA.fieldApiName] = this.tipStudija;
        const recordInput = { apiName: STUDENT.objectApiName, fields };
        console.log(recordInput)
        createRecord(recordInput)
        .then((student) => {
            console.log(student)
            this.studentId = student.id;
            console.log('Student ID: ' + this.studentId);
        })
        .catch((error) => {
            console.error(error)
        });
    }
    handleSubmit(event) {
        console.log('Ime: ' + this.ime);
        console.log('Priimek: ' + this.priimek);
        console.log('EMŠO: ' + this.emso);
        console.log('Tip študija: ' + this.tipStudija);

        if(this.checkEmsoCompute(this.emso)){
            console.log('EMŠO je pravilen');
            this.createAccount();
            const toastEvent = new ShowToastEvent({
                title:"Študent uspešno dodan",
                variant:"success"
            });
            this.dispatchEvent(toastEvent);
        } else {
            console.error('EMŠO je nepravilen');
            const toastEvent = new ShowToastEvent({
                title:"EMŠO je nepravilen",
                variant:"error"
            });
            this.dispatchEvent(toastEvent);
        }
    }

    checkEmso(e) {
        console.log(e)

        fetch('https://app.agilcon.com/job/emso.php?emso=' + e)
        .then(response => {
            console.log(response);
            if(response.status === 200) {
                return response.json();
            } else {
                console.error(response.status);
            }
        })
        .then(data => {
            console.log(data);
            if(data.message == 'OK'){
                return true;
            } else {
                console.error(data.message);
            }
        });
        return false;
    }

    checkEmsoCompute(e) {
        var checks = [7,6,5,4,3,2,7,6,5,4,3,2]
        var vsota = 0;
        if(e.length != 13) {
            return false;
        }
        for(var i = 0; i < e.length - 1; i++) {
            vsota += checks[i] * e[i];
        }
        var control_digit = vsota % 11;
        if(control_digit == 0) {
            control_digit = 0;
        } else {
            control_digit = 11 - control_digit;
        }
        return control_digit == e[12];
    } 
    //UNFINISHED CODE NOT WORKING
    // trigger emsoCheck on Student__c (before insert, before update) {
    //     Student__c students = trigger.new[0];
    //     Decimal emso = students.EMSO__c;
    //     String e = '$' + String.valueOf(emso.format());
    //     List<Integer> checks = new List<Integer>();
    //     checks.add(7);
    //     checks.add(6);
    //     checks.add(5);
    //     checks.add(4);
    //     checks.add(3);
    //     checks.add(2);
    //     checks.add(7);
    //     checks.add(6);
    //     checks.add(5);
    //     checks.add(4);
    //     checks.add(3);
    //     checks.add(2);
    //     Integer vsota = 0;
    //     if(e.length() != 13) {
    //         students.addError('EMŠO ni pravilen');
    //     }
    //     for(Integer i = 0; i < e.length() - 1; i++) {
    //         vsota += checks.get(i) * e.charAt(i);
    //     }
    //     Integer control_digit = math.mod(vsota,11);
    //     if(control_digit == 0) {
    //         control_digit = 0;
    //     } else {
    //         control_digit = 11 - control_digit;
    //     }
    //     if (control_digit != e.charAt(12)) {
    //         students.addError('EMŠO ni pravilen');
    //     } 
    // }
}