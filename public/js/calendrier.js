let date = new Date();
let mois = date.getMonth();
let annee = date.getFullYear();
let bissextile = 2020;
let fotoana = new Date()
let marge = fotoana.getDate()+7
fotoana.setDate(marge)
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
let moisLimite = fotoana.getMonth()+1
let jourLimite = fotoana.getDate()+1
if (moisLimite < 10){
	moisLimite = "0"+moisLimite
}
if (jourLimite < 10){
	jourLimite = "0"+jourLimite
}
function volana(){
	if (mois == 0) {document.getElementById("mois").innerHTML = "Janvier "+annee}; 
	if (mois == 1) {document.getElementById("mois").innerHTML = "Février "+annee}; 
	if (mois == 2) {document.getElementById("mois").innerHTML = "Mars "+annee}; 
	if (mois == 3) {document.getElementById("mois").innerHTML = "Avril "+annee}; 
	if (mois == 4) {document.getElementById("mois").innerHTML = "Mai "+annee}; 
	if (mois == 5) {document.getElementById("mois").innerHTML = "Juin "+annee}; 
	if (mois == 6) {document.getElementById("mois").innerHTML = "Juillet "+annee}; 
	if (mois == 7) {document.getElementById("mois").innerHTML = "Août "+annee}; 
	if (mois == 8) {document.getElementById("mois").innerHTML = "Septembre "+annee}; 
	if (mois == 9) {document.getElementById("mois").innerHTML = "Octobre "+annee}; 
	if (mois == 10) {document.getElementById("mois").innerHTML = "Novembre "+annee}; 
	if (mois == 11) {document.getElementById("mois").innerHTML = "Décembre "+annee};
	calendar();
}
function moisSuivant(){ 
	prev.setAttribute("style","display:in-line-block;background:white;border:5px black solid");
	mois++;
	if (mois > 11) {
		annee++;
		mois = 0;
	} 
	volana();
};
function moisPrecedent(){
	mois--;
	if (mois < 0) {
		annee--;
		mois = 11;
	}
	if (mois == date.getMonth() && annee == date.getFullYear()) {
		prev.setAttribute("style","display:none")
	};
	volana();
}
function jour(fevrier){
	let fev = fevrier;
	let n;
	if (mois<7){
		if (mois%2==0){
			n=31;
		}
		else{
			if (mois==1){
				n=fev;
			}
			else{
				n=30;
			}
		}
	}
	else{
		if (mois%2==0){
			n=30;
		}
		else{
			n=31;
		}
	}
	return n;
}
function biss(){
	let n;
	if (annee==(bissextile+4)){
		bissextile = annee
	}
	if (annee==bissextile){
		n = jour(29)
	}
	else {
		n = jour(28)
	}
	return n; 
}
function calendar(){
	let n = biss();
	let i;
	for (i=0;i<=6;i++){
		let element = document.getElementById(i)
		while (element.firstChild){
			element.removeChild(element.firstChild)	
		}
	}
	for (i=1; i<=n ;i++){
		let bouton= document.createElement("BUTTON")
		let moisExact = mois+1
		let andro = new Date(moisExact+"/"+i+"/"+annee)
		let id = andro.getDay()
		let nomBouton = document.createTextNode(i)
		bouton.appendChild(nomBouton)
		bouton.setAttribute("id",andro.toLocaleDateString("fr-ca",options))
		bouton.setAttribute("onclick","recuperation(this.id)")
		bouton.setAttribute("style","color:white;background:black;font-size:25px")
		bouton.setAttribute("class","col-xs-2")
		bouton.setAttribute("data-toggle","modal")
		bouton.setAttribute("data-target","#reservation")
		if (i==1){
			if (id>0){
				let j
				for (j=0;j<id;j++){
					let tsisy = document.createElement("BUTTON")
					if (j==0){
						tsisy.setAttribute("style","border:none;background:blue")
					}
					else {
						tsisy.setAttribute("style","border:none;background:rgb(175, 22, 22)")
					}
					tsisy.setAttribute("class","col-xs-2")
					tsisy.setAttribute("disabled","disabled")
					document.getElementById(j).appendChild(tsisy)
				}
			}
		}
		if (andro < fotoana){
			if (andro.getDate()==date.getDate()){
				bouton.setAttribute("style","color:black;background:white;font-size:25px")
			}
			else {
				bouton.setAttribute("style","color:black;background:red;font-size:25px")
			}
			bouton.setAttribute("disabled","disabled")
		}
		document.getElementById(id).appendChild(bouton)
	}
	for(i=0;i<document.querySelectorAll("[name='reserver']").length;i++){
		let boutonR = document.getElementById(document.querySelectorAll("[name='reserver']")[i].textContent)
		if (boutonR!=null){
			boutonR.setAttribute("style","color:black;background:red;font-size:25px")
			boutonR.setAttribute("disabled","disabled")
		}
	}
}
function recuperation(donne){
	//var daty = document.getElementById("daty")
	daty.value=donne
	daty.setAttribute("readonly","readonly")
}
function desactive(){
	//var daty = document.getElementById("daty")
	daty.setAttribute("min",fotoana.getFullYear()+"-"+moisLimite+"-"+jourLimite)
	daty.removeAttribute("readonly")
}
function modifier(idt){
	var modal = document.getElementById(idt)
	var dateAdmin = document.getElementById("dateAdmin"+idt)
	if (dateAdmin!=null){
		dateAdmin.setAttribute("min",fotoana.getFullYear()+"-"+moisLimite+"-"+jourLimite)
	}	
	for (i=1;i<modal.querySelectorAll("input").length;i++){
		modal.querySelectorAll("input")[i].removeAttribute("readonly")
	}
}
function arretModif(idt){
	var modal = document.getElementById(idt)
	var d = modal.querySelectorAll("input")
	var n = d.length
	window.location.reload()
	for (i=0;i<n;i++){
		d[i].setAttribute("readonly","readonly")
	}
}
function rechercher(target){
	target.setAttribute("data-target","#M"+document.getElementById('recherche').value)
}
function liste(){
	if (document.getElementById("Bouttonliste").textContent == "Liste des réservations"){
		document.getElementById("Bouttonliste").textContent = "Liste des utilisateurs"
		document.getElementsByName("liste")[1].setAttribute("style","background-color: brown;color: rgb(252, 249, 249);display:none")
		document.getElementsByName("liste")[0].setAttribute("style","background-color: brown;color: rgb(252, 249, 249);display:block")
	}
	else {
		document.getElementById("Bouttonliste").textContent = "Liste des réservations"
		document.getElementsByName("liste")[1].setAttribute("style","background-color: brown;color: rgb(252, 249, 249);display:block")
		document.getElementsByName("liste")[0].setAttribute("style","background-color: brown;color: rgb(252, 249, 249);display:none")
	}
}
volana();



  
 
 