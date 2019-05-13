$(function(){//Attente du chargement complet du DOM avant modification
//******************DECLARATION DES VARIABLES*******************************
//Récupération des noms saisis par le(s) joueur(s)
const p1 = document.querySelector("#form1");  
const p2 = document.querySelector("#form2")
//Préparation des persos et armes
let perso1,
    perso2,
    epee,
    hache,
    lance,
    fleau,
    occupe,
    free,//Tableau pour le positionnement. Est utilisé pour les déplacements
//Préparation du tableau
    aGriser,//Correspond aux cases occupées, sera défini dans la fonction d'occupation du tableau
    result,//Correspond aux index renvoyés par la fonction aleatoire pour le placement des persos
    tableau,//Correspond au tableau global, mis à jour pour les positions
//Préparation des déplacements
    arrayPos = [0, 1, 2, 3, 4, 5],//Tableau des positions des éléments déplaçables - SUPPRIMABLE SI REFRESHPOS RESTE EN objet.position
    dir,//Sera utilisée dans la méthode pour définir la touche pressée
    posP1,//positions
    posP2,
    posW1,
    posW2,
    posW3,
    posW4;

//*****************DECLARATION DES OBJETS, CLASSES ET METHODES******************
//Création d'une classe personnage
class Perso {
    //Constructeur
    constructor(nom, hp, degats, arme, score, avatar, position, classe){
        this.nom = nom;
        this.hp = hp;
        this.degats = degats;
        this.arme = arme;
        this.score = score;
        this.avatar = avatar;
        this.position = position;
        this.classe = classe;
    }
    //Méthode de récupération d'arme
    weapon(nom, degats){
        this.nom = arme.nom;
        this.degats = arme.degats;
        //Attention, où rajouter les dégâts de l'arme à ceux du perso???
    }
    //Méthode d'attaque
    attaque(attaquant, cible){//Ajouter une vérification de la santé de l'adversaire
        let degatsMax = perso.degats + arme.degats;
        cible.hp = cible.hp - (attaquant.degatsMax - cible.defense);
    }
    //Méthode de défense
    defense(){
        let degatsMin = coupRecu - 50;
    }
    //Méthode de déplacement
    move(index){
        //Fonction addImage semblable à la première (ligne 206), mais utilisant directement la position du joueur
        function addImage2(position, avatar, classe){
            let result = $("td").eq(tableau[position]).css({"background-image": 'url("' + avatar + '")', "background-repeat": "no-repeat", "background-position": "center center"}).removeClass("free").addClass(classe);
            console.log("AddImage");
            return result;
        };
        //Préparation d'une fonction de retrait du CSS pour générer le déplacement
        function remove(position, classe){
            $("td").eq(position).css("background-image", "none").removeClass(classe).addClass("free");
            console.log("remove");
        };
        
        $(document).keydown(function(e){
            dir = e.which;
            switch(dir){
                case 39 : //Droite
                    console.log("Position avant mouvement : " + arrayPos[index]);
                    remove(arrayPos[index], this.classe);
                    this.position =  arrayPos[index] + 1;
                    arrayPos[index] = this.position;
                    addImage2(this.position, this.avatar, this.classe);  
                    refreshPos();
                    console.log("Position après mouvement : " + this.position);
                              
                    break;
                case 37 ://Gauche
                    console.log("Position avant mouvement : " + arrayPos[index]);
                    remove(arrayPos[index], this.classe);
                    this.position = arrayPos[index] - 1;
                    arrayPos[index] = this.position;
                    addImage2(this.position, this.avatar, this.classe);
                    refreshPos();
                    console.log("Position après mouvement : " + this.position);
                    this.position
                break;
                case 38 ://Haut
                    console.log("Position avant mouvement : " + arrayPos[index]);
                    remove(arrayPos[index], this.classe);
                    this.position = arrayPos[index] - 10;
                    arrayPos[index] = this.position;
                    addImage2(this.position, this.avatar, this.classe);
                    refreshPos();
                    console.log("Position après mouvement : " + this.position);
                    
                break;
                case 40 ://Bas
                    console.log("Position avant mouvement : " + arrayPos[index]);
                    remove(arrayPos[index], this.classe);
                    this.position = arrayPos[index] + 10;
                    arrayPos[index] = this.position;
                    addImage2(this.position, this.avatar, this.classe);
                    refreshPos();
                    console.log("Position après mouvement : " + this.position);
                    
                break;
                default:
                    refreshPos();
            }   
        });
    };
};

//Création d'une classe arme
class Arme {
    //Constructeur
    constructor(nom, degats, avatar, position, classe){
        this.nom = nom;
        this.degats = degats;
        this.avatar = avatar;
        this.position = position;
        this.classe = classe;
    }
};

    
//Création d'une classe de bloc occupé
class Occuped{
    //Constructeur
    constructor(avatar, classe){
        this.avatar = avatar;
        this.classe = classe;
    }
};
    
//Création d'une classe pour le tableau
class Board{
    //Constructeur
    constructor(lines, cases){
    this.lines = lines;
    this.cases = cases;
    }
};

//Fonction de suppression du css pour retirer l'image
function remove(position){
    $("td").eq(position).css("background-image", "none").removeClass("occuped").addClass("free");
};
    

//Création des personnages
perso1 = new Perso("", 100, 10, "Aucune", 0, "images/minionSmall.png", arrayPos[0], "P1");
perso2 = new Perso("", 100, 10, "Aucune", 0, "images/lapinSmall.jpg", arrayPos[1], "P2");
//Création des armes
w1 = new Arme(epee, 20, "images/epeeSmall.jpg" , arrayPos[2], "W1");
w2 = new Arme(lance, 30, "images/hacheSmall.jpg" , arrayPos[3], "W2");
w3 = new Arme(hache, 25, "images/lanceSmall.jpg" , arrayPos[4], "W3");
w4 = new Arme(fleau, 25, "images/fleauSmall.jpg" , arrayPos[5], "W4");
//Création des blocs occupés
occupe = new Occuped("images/grisSmall.jpg", "occuped");


   

//************************ GENERATION DES PERSONNAGES*****************************
//Joueur1
p1.addEventListener("submit", function(e){
    let saisie1 = form1.elements.nom1;
        $('<h3>Nom : ' + saisie1.value + '</h3>').insertAfter('#img1');
    $('#setP1').append($('<li>Santé : ' + perso1.hp + '</li>'))
    .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
        .append($('<li>Arme : ' + perso1.arme + '</li>'))
            .append($('<li>Score : ' + perso1.score + '</li>'));
    $('#form1').hide();
    e.preventDefault();
});
   
//Joueur2
p2.addEventListener("submit", function(e){
    let saisie2 = form2.elements.nom2;
    $('<h3>Nom : ' + saisie2.value + '</h3>').insertAfter('#img2');
    $('#setP2').append($('<li>Santé : ' + perso2.hp + '</li>'))
    .append($('<li>Dégâts : ' + perso2.degats + '</li>'))
        .append($('<li>Arme : ' + perso2.arme + '</li>'))
            .append($('<li>Score : ' + perso2.score + '</li>'));
    $('#form2').hide();
    e.preventDefault();
});

function refreshPos(){
    //Mise à jour du tableau avec les nouvelles positions
    tableau = Array.from(document.querySelectorAll("td"));
    //Cette fonction renvoie la position de l'élément passé en paramètre.
    function position(elt){
        let result = tableau.indexOf(document.querySelector(elt)); 
        return result;
    };
    perso1.position = position(".P1");
    perso2.position = position(".P2");
    w1.position = position(".W1");
    w2.position = position(".W2");
    w3.position = position(".W3");
    w4.position = position(".W4");
    arrayPos = [perso1.position, perso2.position, w1.position, w3.position, w4.position];
    console.log(arrayPos);
    return arrayPos;
};
//************************GENERATION DU PLATEAU***********************************
//Action au clic sur "Lancer !"
$('#place').click(function(e){ 
//Désactivation du bouton, NE PAS RETIRER, il reste visible le temps du développement
    //$('#place').hide();
//Avant tout, suppression du contenu s'il existait déjà pour repartir sur un plateau neuf
    $("td, tr, table").remove();
//Première étape : création du plateau
    $('#battlefield').prepend($('<table>')
        .attr('id', 'playBoard1'));
    const board1 = new Board(9, 9);
    const lines = board1.lines;
    const cases = board1.cases;
    for (i=0; i<=lines; i++){
        $('table').append($('<tr>'));
    };
    $('tr').each(function(){
        for (i=0; i<=cases; i++){
            $(this).append($('<td class="free">'));
        };
    });
   
   
//Lancement du positionnement de tous les éléments (cases occupées, armes et persos)
//$("td").css({'background-color': 'white', "background-image": "none"}).removeClass("occuped").addClass("free");//On remet tout en blanc avant de relancer A CONSERVER, servira à réinitialiser le plateau
    let free = document.querySelectorAll(".free");//Renvoie un array de toutes les cases .free
    function melt (){
        aGriser = (Math.floor(Math.random()*free.length));//Renvoie une valeur au hasard dans ce tableau  
        return aGriser;
    };
    //Fonction d'ajout de l'image
    function addImageCss(avatar, classe){
        let result = $("td").eq(arr[arrIndex]).css({"background-image": 'url("' + avatar + '")', "background-repeat": "no-repeat", "background-position": "center center"}).removeClass("free").addClass(classe);
        return result;
    };
    //Fonction de vérification de 2 valeurs avant ajout dans le tableau
    //Est utilsée pour le P2, afin d'éviter une apparition collée au P1
    function check(value1, value2){
	   if (value1 != value2 && value1 != value2 -11 && value1 != value2 -10 && value1 != value2 -9 && value1 != value2 -1 && value1 != value2 +1 && value1 != value2 +9 && value1 != value2 +10 && value1 != value2 +11){
           arr.push(value1);
	   };
        return arr;
    };
    //Création d'un array pour stocker les valeurs renvoyées par la fonction melt
    let arr = [];
    //Ajout de 15 valeurs dans le tableau
    while(arr.length<=14){//On limite la taille du tableau 
        melt();
        if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(aGriser);
        };
    };
    //Ajout du P2 dans le tableau, en vérifiant sa proximité avec P1
     while(arr.length<=15){//On limite la taille du tableau 
         melt();
         if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
             //Si cette valeur n'est pas trop proche de la précédente
             check(aGriser, arr[14]);
             //check insère aGriser si sa valeur passe toutes les vérifications
        }; 
    };
    

    //Piste de boucle imbriquée pour la fonction check
 /*   
i= 1;

while(i<14){ //Toutes les valeurs de 0 à 15 
	j=0;
	blablabla;
	while(j<i){//Vérifie une valeur avant de l'ajouter dans le tableau
		j++;
	}
	i++;
};*/
    
   
    
    console.log(arr);
    let arrIndex = 0;
    //arr[arrIndex] permet de faire correspondre l'index du plateau (arr) avec la valeur d'une boucle de 16 tours utilisée ensuite (arrIndex)
    for(i=0; i<= 15; i++){
        if (arrIndex<= 9){//Fera donc 10 tours en changeant le css en grey
            addImageCss(occupe.avatar, occupe.classe);
            arrIndex ++;//On augmente la valeur d'arrIndex à chaque fois, pour ne pas repasser sur la même case
        } else if (arrIndex>9 && arrIndex <= 13){//4 tours avec les armes
            //Switch sur les index concernés pour attribuer une arme différente à chaque fois
            switch(arrIndex){
                case 10:
                    addImageCss(w1.avatar, w1.classe);
                    arrIndex++;
                break;
                case 11 :
                    addImageCss(w2.avatar, w2.classe);
                    arrIndex++;
                break;
                case  12:
                    addImageCss(w3.avatar, w3.classe);
                    arrIndex++;
                break;
                case 13 :
                    addImageCss(w4.avatar, w4.classe);
                    arrIndex++;
                break;
                default:
                    arrIndex++;             
            };
        } else if (arrIndex == 14) {//1 tour pour le perso1
            addImageCss(perso1.avatar, perso1.classe);
            arrIndex ++;
        } else if (arrIndex == 15) {//1 dernier tour pour le perso2
            addImageCss(perso2.avatar, perso2.classe);
        };
    };
    refreshPos();//Permet de définir les positions des deux joueurs en fonciton des cases ayant les classes .P1 et .P2
        console.log(perso1.position);


refreshPos(perso1);
    console.log(perso1.position);
});//Ne pas retirer, fin de la fonction de création du plateau


    
//********************************DEBUT D'ESSAI DE  DEPLACEMENT***********************************
$(document).keydown(function(){
refreshPos();
  perso1.move(0); 
});
 

});//Ne pas retirer, fin de la fonction de chargement du DOM
