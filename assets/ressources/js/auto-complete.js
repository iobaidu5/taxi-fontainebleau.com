var autocomplete, autocomplete2;
var outputDiv = document.getElementById('output');
outputDiv.innerHTML = '<button type="button" class="button btn-block" onclick="Calcul()">Calculer</button>';
var prix;
var coutInit = 2.2;
var coutSuppPercentInit = 15;
var hourdep;
var datedep;
var prix_min = 15;

var remise = 10;

function isPageResa(){
   var id = $(".container.reservation").attr("id");
   
   if(id == 'yes'){
     return true;
   }else{
     return false;
   }
}


$(":input").bind("keyup change", function(e) {
    outputDiv.innerHTML = '<button type="button" class="button btn-block" onclick="Calcul()">Calculer</button>';
});



// DATE SERVEUR
var xmlHttp;
function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}

// JOURS FERIER
function JoursFeries (an){
	var JourAn = new Date(an, "00", "01")
	var FeteTravail = new Date(an, "04", "01")
	var Victoire1945 = new Date(an, "04", "08")
	var FeteNationale = new Date(an,"06", "14")
	var Assomption = new Date(an, "07", "15")
	var Toussaint = new Date(an, "10", "01")
	var Armistice = new Date(an, "10", "11")
	var Noel = new Date(an, "11", "25")
	// var SaintEtienne = new Date(an, "11", "26")
	
	var G = an%19
	var C = Math.floor(an/100)
	var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30
	var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11))
	var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7
	var L = I - J
	var MoisPaques = 3 + Math.floor((L + 40)/44)
	var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4)
	var Paques = new Date(an, MoisPaques-1, JourPaques)
	// var VendrediSaint = new Date(an, MoisPaques-1, JourPaques-2)
	var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1)
	var Ascension = new Date(an, MoisPaques-1, JourPaques+39)
	var Pentecote = new Date(an, MoisPaques-1, JourPaques+49)
	var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50)
	
	return new Array(JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel)
}

function ConvertIso(date, hour){
    var from = date.split("/");
    var hr = hour.split(":");
    //console.log(from);
    var dateIso = new Date(from[2], from[1] - 1, from[0]);
    dateIso.setHours(hr[0]);
    dateIso.setMinutes(hr[1]);
    return dateIso;
}

// DATE FR
function FullDate(date){
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  date = dd + '/' + mm + '/' + yyyy;
  return date;
}


// HEURE
function FullHour(date){
  var hh = date.getHours()
  var mn = (date.getMinutes()<10?'0':'') + date.getMinutes();

  hour = hh + ':' + mn;
  return hour;
}

var st = srvTime();
// Cout par heure est date


if(st){
  var currentD = new Date(st);

  console.log(currentD);
  //currentD.setMinutes(currentD.getMinutes()+45);
  var startHourD = new Date(st);
  startHourD.setHours(7,0,0); // 7:00
  var endHourD = new Date(st);
  endHourD.setHours(19,0,0); // 19:00

  console.log(endHourD);

}else{
  var currentD = new Date();
  //currentD.setMinutes(currentD.getMinutes()+45);
  var startHourD = new Date();
  startHourD.setHours(7,0,0); // 7:00
  var endHourD = new Date();
  endHourD.setHours(19,0,0); // 19:00
}

// DETERMINER SI JOURS FERIES DE L'ANNEE
function DateFerie(date){
  var FullYear = currentD.getFullYear();
  var jf = JoursFeries(FullYear);
  var isJf = false;
  var arrLength = jf.length;

  for(var i = 0; i < arrLength; i++){
    if(FullDate(jf[i]) === FullDate(date))
    {  
      isJf =true;
    }
  }

  return isJf;
}


// DATE DU JOUR
var dateNow = FullDate(currentD);
var hourNow = FullHour(currentD);

// PAR DEFAUT ON ASSIGNE LA DATE ET L'HEURE DU JOUR SUR LA PREMIERE PAGE
if(!isPageResa()){
  document.querySelector("[name='date1']").value = dateNow;
  document.querySelector("[name='hour1']").value = hourNow;
}


// ON RECUPERE LA VALEUR PAR DEFAUT
datedep = document.querySelector("[name='date1']").value;
hourdep = document.querySelector("[name='hour1']").value;



var currentDForm = ConvertIso(datedep, hourdep);

function DayName(date){
  return date.toString().split(' ')[0]
}

// ALLER
function DateChange() {

  datedep = document.querySelector("[name='date1']").value;
  document.querySelector("[name='date1']").setAttribute('value', datedep);

  hourdep = document.querySelector("[name='hour1']").value;
  document.querySelector("[name='hour1']").setAttribute('value', hourdep);

  var dateValue = ConvertIso(datedep, hourdep);

  return dateValue;
}

function Cout() {

  var DateForm;
  var cout = coutInit;
  var coutSuppPercent = coutSuppPercentInit;
  var dateChange = DateChange();

  if(dateChange){
    DateForm = dateChange;
  }else{
    DateForm = currentDForm;
  }

  if(DateFerie(DateForm)){
      coutSupp = coutSuppPercent*cout/100;
      cout = cout + coutSupp;
      cout = Math.round(cout*100)/100;
  }else{
    if(DayName(DateForm) == 'Sun'){
      coutSupp = coutSuppPercent*cout/100;
      cout = cout + coutSupp;
      cout = Math.round(cout*100)/100;
    }else{
      if(DateForm){
        if(DateForm.getHours() > startHourD.getHours() && DateForm.getHours() < endHourD.getHours()){
          cout = cout;
        }else{
          coutSupp = coutSuppPercent*cout/100;
          cout = cout + coutSupp;
          cout = Math.round(cout*100)/100;
        }
      }else{
        if(currentD.getHours() >= startHourD.getHours() && currentD.getHours() <= endHourD.getHours()){
          cout = cout
        }else{
          coutSupp = coutSuppPercent*cout/100;
          cout = cout + coutSupp;
          cout = Math.round(cout*100)/100;
        }
      }
    }
  }

  return cout;
}


// RETOUR

if(isPageResa()){
  function DateChange2() {

    dateret = document.querySelector("[name='date2']").value;
    document.querySelector("[name='date2']").setAttribute('value', dateret);

    hourret = document.querySelector("[name='hour2']").value;
    document.querySelector("[name='hour2']").setAttribute('value', hourret);

    var dateValue = ConvertIso(dateret, hourret);

    console.log(dateValue);

    return dateValue;
  }

  function Cout2() {

    var DateForm;
    var cout = coutInit;
    var coutSuppPercent = coutSuppPercentInit;
    var dateChange2 = DateChange2();

    if(dateChange2){
      DateForm = dateChange2;
    }else{
      DateForm = null;
    }

    if(DateFerie(DateForm)){
        coutSupp = coutSuppPercent*cout/100;
        cout = cout + coutSupp;
        cout = Math.round(cout*100)/100;
    }else{
      if(DayName(DateForm) == 'Sun'){
        coutSupp = coutSuppPercent*cout/100;
        cout = cout + coutSupp;
        cout = Math.round(cout*100)/100;
      }else{
        if(DateForm){
          if(DateForm.getHours() >= startHourD.getHours() && DateForm.getHours() <= endHourD.getHours()){
            cout = cout;
          }else{
            coutSupp = coutSuppPercent*cout/100;
            cout = cout + coutSupp;
            cout = Math.round(cout*100)/100;
          }
        }else{
          if(currentD.getHours() >= startHourD.getHours() && currentD.getHours() <= endHourD.getHours()){
            cout = cout
          }else{
            coutSupp = coutSuppPercent*cout/100;
            cout = cout + coutSupp;
            cout = Math.round(cout*100)/100;
          }
        }
      }
    }

    return cout;
  }

}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
    {componentRestrictions: {country: 'fr'},
    types: ['geocode']});
  autocomplete2 = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
    {componentRestrictions: {country: 'fr'},
    types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed');
  autocomplete2.addListener('place_changed');
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
      autocomplete2.setBounds(circle.getBounds());
    });
  }
}


function initMap(cout, cout2) {

  dateChange = DateChange();
  if(dateChange){
    DateForm = dateChange;
  }else{
    DateForm = currentDForm;
  }

  if(isPageResa()){
    var isDateForme2 = false;
    dateChange2 = DateChange2();
    dateret = document.querySelector("[name='date2']").value;
    hourret = document.querySelector("[name='hour2']").value;

    if(dateret !='' && hourret != ''){
      isDateForme2 = true;
    }

    if(dateChange2){
      DateForm2 = dateChange2;
      dateRet = FullDate(DateForm2);
      hourRet = FullHour(DateForm2);
      
    }else{
      DateForm2 = null;
    }
  }else{
    DateForm2 = null;
  }

  dateDep = FullDate(DateForm);
  hourDep = FullHour(DateForm);
  NowD = new Date();
  NowD.setMinutes(NowD.getMinutes()+45);

  var depart = document.getElementById("autocomplete").value;
  var destination = document.getElementById("autocomplete2").value;

  var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
    origins: [depart],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;

        for (var j = 0; j < results.length; j++) {
          var km = (results[j].distance.value / 1000).toFixed(1) ;
          var tarif = km*cout;

         
          var tarif2 = km*cout2;
          prix2 = Math.round(tarif2*100)/100;
          
          

          prix = Math.round(tarif*100)/100;

          var total = prix + prix2;

          if(prix2 > 0){
            var old_total = total;
            var old_prix2 = Math.round(prix2*100)/100;
            res = (remise*prix2)/100;
            prix2 = prix2 - res;
            total =  prix + prix2;
            total = Math.round(total*100)/100;
          }
          
          //temps = results[j].duration.text;
          console.log(prix);
          console.log(prix2);
          console.log(old_total);
          console.log(total);

        
              if(DateForm <= NowD){
                outputDiv.innerHTML = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Le dÃ©lai minium de rÃ©servation est de 45 min afin de vous mettre un chauffeur Ã  disposition.<br>Pour toutes rÃ©servation immÃ©diate contactez nous par tÃ©lÃ©phone.</div><br><button type="button" class="button btn-block" onclick="Calcul()">Calculer</button>'
              }else{
                if(isDateForme2){

                  if(total >= prix_min){
                      outputDiv.innerHTML = '<h3> Remise de '+remise+' % sur <del>'+ old_prix2 +' â‚¬</del> sur votre trajet retour ! </h3> <h3>Total avant remise: <del>' + old_total + ' â‚¬</del></h3> <h2>Total : ' + total +' â‚¬</h2> '+ '<small><i>'+ cout +' â‚¬ / km calculÃ© pour le '+dateDep+' pour un dÃ©part Ã  '+hourDep+'</i></small><br><small><i>'+ cout2 +' â‚¬ / km calculÃ© pour le '+dateRet+' pour un retour Ã  '+hourRet+'</i></small>'+ '<input type="hidden" name="prix" value="'+total+'"><br><button type="submit" class="button btn-block" name="devis" value="Envoyer">Je reserve !</button>';
                    }else{
                      outputDiv.innerHTML = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Le prix minium de rÃ©servatioin est de '+prix_min+'â‚¬ souhaitez-vous valider votre course pour '+prix_min+'â‚¬ ? </div>' + '<h3>Prix : ' + prix_min +' â‚¬</h3> '+ '<small><i>'+ cout +' â‚¬ / km calculÃ© pour le '+dateDep+' pour un dÃ©part Ã  '+hourDep+'</i></small><br><small><i>'+ cout2 +' â‚¬ / km calculÃ© pour le '+dateRet+' pour un retour Ã  '+hourRet+'</i></small>'+ '<input type="hidden" name="prix" value="'+prix_min+'"><br><button type="submit" class="button btn-block" name="devis" value="Envoyer">Je reserve !</button>'
                    }

                }else{
                  if(prix >= prix_min){
                    outputDiv.innerHTML = '<h3>Prix : ' + prix +' â‚¬</h3> '+ '<small><i>'+ cout +' â‚¬ / km calculÃ© pour le '+dateDep+' pour un dÃ©part Ã  '+hourDep+'</i></small><br>'+ '<input type="hidden" name="prix" value="'+prix+'"> <button type="submit" class="button btn-block" name="devis" value="Envoyer">Je reserve !</button>';
                  }else{
                    outputDiv.innerHTML = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Le prix minium de rÃ©servatioin est de '+prix_min+'â‚¬ souhaitez-vous valider votre course pour '+prix_min+'â‚¬ ? </div>' + '<h3>Prix : ' + prix_min +' â‚¬</h3> '+ '<small><i>'+ cout +' â‚¬ / km calculÃ© pour le '+dateDep+' pour un dÃ©part Ã  '+hourDep+'</i></small><br>'+ '<input type="hidden" name="prix" value="'+prix_min+'"><button type="submit" class="button btn-block" name="devis" value="Envoyer">Je reserve !</button>';
                  }
                }
              }
        }
      }
    }
  });
}

function Calcul() {
  cout = Cout();

  if(isPageResa()){
    cout2 = Cout2();
    if(!cout2){
      cout2 = null;
    }
  }else{
    cout2 = null;
  }
  
  initMap(cout, cout2);
}