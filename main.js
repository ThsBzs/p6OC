$(function(){//Attente du chargement complet du DOM avant modification
//******************DECLARATION DES VARIABLES*******************************
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
    arrayPos = [],
    arrayUp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],//Bordure haute
    arrayLeft = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],//Bordure gauche
    arrayDown = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],//Bordure basse
    arrayRight = [9,19, 29, 39, 49, 59, 69, 79, 89, 99],//Bordure droite
    tour = 0,//Permet de choisir le joueur dont c'est le tour
    moves = 0,
    round = 0,//Tour de combat
    playP1 = false,
    inFight = false,//permet de bloquer les touches si on entre en phase de combat
    dir;

//*****************DECLARATION DES OBJETS, CLASSES ET METHODES******************
//Création d'une classe personnage
class Perso {
    //Constructeur
    constructor(nom, hp, degats, arme, score, avatar, position, classe, hasWeapon, weaponClass, weaponAvatar, hasShield, alive){
        this.nom = nom;
        this.hp = hp;
        this.degats = degats;
        this.arme = arme;
        this.score = score;
        this.avatar = avatar;
        this.position = position;
        this.classe = classe;
        this.hasWeapon = hasWeapon;
        this.weaponClass = weaponClass;
        this.weaponAvatar = weaponAvatar;
        this.hasShield = hasShield;
        this.alive = alive;
    }
    //Méthode de mise à jour après combat
    newRound(perso){
        perso.alive = true;
        perso.hp = 100;
        perso.degats = 10;
        perso.arme = "Aucune";
        perso.hasWeapon = false;
        perso.weaponClass = "";
        perso.weaponAvatar = "";
        perso.hasShield = false;
    };
    //Méthode d'attaque
    attaque(attaquant, cible){
        //Si les persos ont encore de la vie
        //if(attaquant.hp > 0 && cible.hp > 0){
            //Si le bouclier n'est pas utilisé, dégâts 100%
            if (cible.hasShield == false) {
                if((cible.hp - attaquant.degats) > 0 ){
                    cible.hp -= attaquant.degats;
                    refreshP1();
                    refreshP2();
                } else if ((cible.hp - attaquant.degats) <= 0 ){
                    cible.hp = 0;
                    cible.alive = false;
                    tour = 0;
                    moves = 0;
                    attaquant.score ++;
                    refreshP1();
                    refreshP2();
                }
            //Si le bouclier est utilisé, on divise les dégâts reçus par 2
            } else {
                if((cible.hp - (attaquant.degats / 2)) > 0 ){
                    cible.hp -= (attaquant.degats / 2); 
                    cible.hasShield == false;
                    refreshP1();
                    refreshP2();
                } else if ((cible.hp - (attaquant.degats / 2)) <= 0 ){
                    cible.hasShield = false;
                    cible.hp = 0;
                    cible.alive = false;
                    tour = 0;
                    moves = 0;
                    attaquant.score ++;
                    refreshP1();
                    refreshP2();
                }
            };
            //On rafraîchit P1 et P2 
            
        //};
        //Ajout du score en cas de victoire
       /* if (perso1.hp <= 0){
            perso2.score ++;
        } else if (perso2.hp <= 0){
            perso1.score ++;
        };*/
        //Sortie du tour de la méthode d'attaque pour pouvoir l'utiliser en dehors
        /*tour ++;
        return tour;*/
    };
    
    //Méthode de récupération d'arme
    
    //Méthode de déplacement n'utilisant pas de paramètre 
    move(perso){
        //Fonction pour l'affichage des boutons d'attaque/défense
        function checkFight(){
            if (perso2.position == perso1.position -10 ||
                perso2.position == perso1.position +10 ||
                perso2.position == perso1.position -1 ||
                perso2.position == perso1.position +1 
            ){
                inFight = true;
                $('#masque').fadeIn();
                $('#fightRing').hide();
            }
            return inFight;
        };
        //Préparation des fonctions up et down
        let droite  = +1;
        let gauche = -1;
        let haut = -10;
        let bas = +10; 
        function movePlayer(value){
            if ((!$('td').eq(perso.position + value).hasClass("occuped")) && 
                    (!$('td').eq(perso.position + value).hasClass("P1")) &&
                    (!$('td').eq(perso.position + value).hasClass("P2")) 
                ){
                    remove(perso.position, perso.classe);//Retire l'image avec la fonction remove()
                    perso.position = perso.position + value;//Met à jour la position en lui donnant en valeur celle passée en paramètre +1
                    addImage(perso.position, perso.avatar, perso.classe);//Ajoute, via la fonction addImage, le CSS.
                    refreshPos();//Met à jour le tableau des positions.
                    checkFight();//Vérifie si les deux persos sont côte-à-côte
                    moves ++;
                };
        };
        switch(dir){
            case 39 : //Droite
                if (arrayRight.indexOf(this.position) == -1){
                    movePlayer(droite);
                };
                break;
            case 37 ://Gauche
                if (arrayLeft.indexOf(this.position) == -1){
                    movePlayer(gauche);
                };
            break;
            case 38 ://Haut
                if (arrayUp.indexOf(this.position) == -1) {
                    movePlayer(haut)  
                };
            break;
            case 40 ://Bas
                if (arrayDown.indexOf(this.position) == -1){
                    movePlayer(bas);
                };
            break;
            default:
                refreshPos();
            }  
        return inFight;
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
    constructor(avatar, classe, position){
        this.avatar = avatar;
        this.classe = classe;
        this.position = position;
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

//**********************************PREPARATION DES FONCTIONS UTILISEES POUR LES DEPLACEMENTS****************************************
//Fonction de suppression du css pour retirer l'image
function remove(position, classe){
    $("td").eq(position).removeAttr("style").removeClass(classe).addClass("free");
    //$("td").eq(position).css("background-image", "none").removeClass(classe).addClass("free");
};
//Ajout de l'image
function addImage(position, avatar, classe){
    let result = $("td").eq(position).css({"background-image": 'url("' + avatar + '")', "background-repeat": "no-repeat", "background-position": "center center"}).removeClass("free").addClass(classe);
    return result;
};
//Mise à jour du plateau, appelé à chaque tour pour récupérer correctement les positions dans le déplacement
function refreshPos(){
    //Mise à jour du tableau avec les nouvelles positions
    //On vide le tableaux avant de les remplir avec les nouvelles valeurs
    arrayPos = [] ;
    tableau = [];
    tableau = Array.from(document.querySelectorAll("td"));
    //Cette fonction renvoie la position de l'élément passé en paramètre.
    function position(elt){//elt est la classe correspondante au perso ou arme concerné
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
    //Ce if évite que la fonction checkPos soit appelée sans nécessité sur un joueur immobile.
    if(p1Play == true){
        checkPos(perso1);
    } else {
        checkPos(perso2);
    };
    return arrayPos;//ArrayPos est le tableau des positions, permet de travailler ensuite sur toutes les positions
};   
//Fonction de récupération d'arme
function addWeapon(player, weapon, classe){
    if(player.position == weapon.position){
        //On vérifie si le joueur avait une arme. Si oui, on dépose l'ancienne sur le plateau.
        if(player.hasWeapon == true){
            $('td').eq(player.position).addClass(player.weaponClass).removeClass(free);
        };
        //On réinitialise les dégâts de base
        player.degats = 10;
        //On ajoute les infos de l'arme au perso
        player.arme = weapon.nom;
        player.degats += weapon.degats;
        player.weaponClass = weapon.classe;
        player.weaponAvatar = weapon.avatar;
        //On retire l'arme de la case 
        $('td').eq(weapon.position).removeClass(classe);
        //On met à jour le hasWeapon sur vrai
        player.hasWeapon = true;
    };
};
    
function checkPos(player){
    addWeapon(player, w1, "W1");
    addWeapon(player, w2, "W2");
    addWeapon(player, w3, "W3");
    addWeapon(player, w4, "W4");
    refreshP1();
    refreshP2();
};
//Insertion provisoire de la vérification de la vie pour les conditions de victoire
//Fonctions d'affichage en HTML des caractéristiques des personnages, utilisée pour mettre à jour ces infos durant le jeu
function refreshP1(){
    $('#setP1, #setP1Box').empty();
    $('#setP1, #setP1Box').append($('<li>Santé : ' + perso1.hp + '</li>'))
        .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
            .append($('<li>Arme : ' + perso1.arme + '</li>'))
                .append($('<li>Score : ' + perso1.score + '</li>'));
    if (perso1.hasWeapon == true){
        $('#weaponP1, #weaponP1Box').empty();
        $('#weaponP1, #weaponP1Box').append($('<img src="' + perso1.weaponAvatar + '"/>'));
    } else {
        $('#weaponP1, #weaponP1Box').empty();
    };
    //Fonction de vérification de la vie des joueurs pour les conditions de victoire
    if(perso1.alive == false){
        $('#reload').hide();
        $('#fightRing, .title').hide().fadeOut();
        $('.victoryP2').fadeIn();
        $('#reload').fadeIn();
    };
};
    
function refreshP2(){
    $('#setP2, #setP2Box').empty();
    $('#setP2, #setP2Box').append($('<li>Santé : ' + perso2.hp + '</li>'))
        .append($('<li>Dégâts : ' + perso2.degats + '</li>'))
            .append($('<li>Arme : ' + perso2.arme + '</li>'))
                .append($('<li>Score : ' + perso2.score + '</li>'));
    if (perso2.hasWeapon == true){
        $('#weaponP2, #weaponP2Box').empty();
        $('#weaponP2, #weaponP2Box').append($('<img src="' + perso2.weaponAvatar + '"/>'));
    } else {
        $('#weaponP2, #weaponP2Box').empty();
    };
    //Essai d'animation plus propre
    if (perso2.alive == false){
        $('#reload').hide();
        $('#fightRing, .title').hide().fadeOut();
        $('.victoryP1').fadeIn();
        $('#reload').fadeIn();
    };
};
    
    
//Fonction regroupant toutes les créations de personnages et armes
    //Création des personnages
    perso1 = new Perso("", 100, 10, "Aucune", 0, "images/minionSmall.png", arrayPos[0], "P1", false, "", "", false, true);
    perso2 = new Perso("", 100, 10, "Aucune", 0, "images/lapinSmall.png", arrayPos[1], "P2", false, "", "", false, true);
    //Création des armes
    w1 = new Arme("Epée", 20, "images/epeeSmall.png" , arrayPos[2], "W1");
    w2 = new Arme("Hache", 30, "images/hacheSmall.png" , arrayPos[3], "W2");
    w3 = new Arme("Lance", 25, "images/lanceSmall.png" , arrayPos[4], "W3");
    w4 = new Arme("Fléau", 25, "images/fleauSmall.png" , arrayPos[5], "W4");
    //Création des blocs occupés
    occupe = new Occuped("images/grisSmall.jpg", "occuped");


   

//************************ AJOUT DES NOMS DES PERSONNAGES EN HTML*****************************
//Joueur1
$('#form1').submit(function(e){
    let saisie1 = form1.elements.nom1;
    $($('<h3>Nom : ' + saisie1.value + '</h3>')).insertAfter('#img1');
    $($('<h3>Nom : ' + saisie1.value + '</h3>')).insertAfter('#img1Box');
    refreshP1();
    $('#form1').hide();
    e.preventDefault();
});

//Joueur2
$('#form2').submit(function(e){
    let saisie2 = form2.elements.nom2;
    $($('<h3>Nom : ' + saisie2.value + '</h3>')).insertAfter('#img2');
    $($('<h3>Nom : ' + saisie2.value + '</h3>')).insertAfter('#img2Box');
    refreshP2();
    $('#form2').hide();
    e.preventDefault();
});


//************************GENERATION DU PLATEAU***********************************
//Action au clic sur "Lancer !"

$('#place, #reload').click(function(e){
    console.log("clic sur reload");
        tour = 0;
        moves = 0;
        $('.stopP1, .stopP2').empty();
        $('#masque, #reload').hide();
        $("td, tr, table").remove();
        $('#explain, #showFightRing, .title').show();
        $('#rulesBox').fadeOut();
        perso1.newRound(perso1);
        perso2.newRound(perso2);
        refreshP1();
        refreshP2();
        console.log(perso1);
        console.log(perso2);
        //Essai de réactivation des touches. Ne Fonctionne pas encore.
        $(document).on('keydown');
        //Essai de la même chose avec une variable
        inFight = false;
        //Masquage du bouton de nouvelle partie
        $('#reload, .victoryP1, .victoryP2').hide();
        $('#fightRing').show();
        //Désactivation du bouton, il reste visible le temps du développement
        $('#place').hide();
        //Avant tout, suppression du contenu s'il existait déjà pour repartir sur un plateau neuf
        //$('#battlefield').empty();
        $("td, tr, table").remove();
        //Première étape : création du plateau
        $('#battlefield').append($('<table>')
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
        let free = document.querySelectorAll(".free");//Renvoie un array de toutes les cases .free
        function melt (){
            aGriser = (Math.floor(Math.random()*free.length));//Renvoie une valeur au hasard dans ce tableau  
        };
        //Création d'un array pour stocker les valeurs renvoyées par la fonction melt
        let arr = [];
        melt();
        console.log("Agriser = " + aGriser);
        arr.push(aGriser);
        //Fonction de vérification de 2 valeurs avant ajout dans le tableau
        //Est utilsée pour le P2, afin d'éviter une apparition collée au P1
        let essai = [];
        let checked;
        function check(value1, value2){
            let arrToCheck = [(value2 -11), (value2 -10), (value2 -9), (value2 -1), (value2 +1), (value2 +9), (value2 +10), (value2 +11)];
            /*if(!essai.includes(arrToCheck)){
                essai.push(arrToCheck);
            }*/
            if ((!arr.includes(value1)) && !arrToCheck.includes(value1)) {
                checked = value1;
                console.log("Checked = " + checked);
                console.log("ArrToCheck = " + arrToCheck);
            };
        };
    
        
        i = 1;
        while (i < 17) {
            melt();
            for (j = 0, j < arr.length; j <= i; j++){
                check(aGriser, arr[j]);
                if((checked !== undefined) && (checked !== -1)){
                    arr.push(checked);
                };
            };
                i ++;
            };
        


    //************************MISE EN ATTENTE POUR PASSAGE EN BOUCLE SESSION MENTORAT**************************
    //Ajout de 15 valeurs dans le tableau
/*    while(arr.length<=14){//On limite la taille du tableau 
        melt();
        if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(aGriser);
        };
    };
    //Ajout du P2 dans le tableau, en vérifiant sa proximité avec P1
    //Ajout du P2 dans le tableau, en vérifiant sa proximité avec P1
     while(arr.length<=15){//On limite la taille du tableau 
         melt();
         if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
             //Si cette valeur n'est pas trop proche de la précédente
             check(aGriser, arr[14]);
             //check insère aGriser si sa valeur passe toutes les vérifications
        }; 
    };*/
    //********************************FIN DE MISE EN ATTENTE******************************

    //Première version d'une boucle pour le placement avec vérification des positions
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
       
        //console.log("Arr = " + arr);
        let arrIndex = 0;
        //arr[arrIndex] permet de faire correspondre l'index du plateau (arr) avec la valeur d'une boucle de 16 tours utilisée ensuite (arrIndex)
        for(i=0; i<= 15; i++){
            if (arrIndex<= 9){//Fera donc 10 tours en changeant le css en grey
                addImage(arr[arrIndex], occupe.avatar, occupe.classe);
                arrIndex ++;//On augmente la valeur d'arrIndex à chaque fois, pour ne pas repasser sur la même case
            } else if (arrIndex>9 && arrIndex <= 13){//4 tours avec les armes
                //Switch sur les index concernés pour attribuer une arme différente à chaque fois
                switch(arrIndex){
                    case 10:
                        addImage(arr[arrIndex], w1.avatar, w1.classe);
                        arrIndex++;
                        break;
                    case 11 :
                        addImage(arr[arrIndex], w2.avatar, w2.classe);
                        arrIndex++;
                        break;
                    case  12:
                        addImage(arr[arrIndex], w3.avatar, w3.classe);
                        arrIndex++;
                        break;
                    case 13 :
                        addImage(arr[arrIndex], w4.avatar, w4.classe);
                        arrIndex++;
                        break;
                    default:
                        arrIndex++;             
                };
            } else if (arrIndex == 14) {//1 tour pour le perso1
                addImage(arr[arrIndex], perso1.avatar, perso1.classe);
                arrIndex ++;
            } else if (arrIndex == 15) {//1 dernier tour pour le perso2
                addImage(arr[arrIndex], perso2.avatar, perso2.classe);
            };
        };
        refreshPos();//Permet de définir les positions des deux joueurs en fonciton des cases ayant les classes .P1 et .P2
        possible(perso1.position);//Ne pas retirer, permet de lancer la fonction possible dès le début du jeu
    return inFight;
});//Ne pas retirer, fin de la fonction de création du plateau
    
//**************************************DEPLACEMENT + INDICATION DE CASES POSSIBLES***********************************
//Fonction de coloration des cases de déplacement possible
function possible(position){
    $('td').removeClass("possible");//On retire toutes les cases colorées
    //Essai d'une fonction pour regrouper toutes les suivantes
    function checkPossible(array, pos1, pos2, pos3){
        if((array.indexOf(position) == -1) &&//Si la position du joueur n'est pas une bordure basse
            (moves < 3)//Et si les mouvements sont à 0
        ){
            checkNext(position + pos1);//On envoie sur la case suivante vers le bas la classe possible.
            if (!$('td').eq(position + pos1).hasClass("occuped")&&//Même opération avec les cases suivantes, en modifiant les valeurs
                (array.indexOf(position + pos1) == -1) &&
                (moves < 2)
            ){
                checkNext(position + pos2);
                if (!$('td').eq(position + pos2).hasClass("occuped")&&
                    (array.indexOf(position + pos2) == -1) &&
                    (moves < 1)
                ){
                    checkNext(position + pos3);
                };
            };
        };
    };
    checkPossible(arrayDown, +10, +20, +30);
    checkPossible(arrayUp, -10, -20, -30);
    checkPossible(arrayLeft, -1, -2, -3);
    checkPossible(arrayRight, +1, +2, +3);
};
    
function checkNext(position){
    if((!$('td').eq(position).hasClass("occuped"))){
        $('td').eq(position).addClass("possible");
    };
};


//Essai de blocage de la fonction de déplacement avec un bool
let p1Play;
//Fonction de déplacement
    $(document).keydown(function(e){
        if (inFight == false){
            dir = e.which;
            if (tour%2 == 0){
                p1Play = true;
                possible(perso1.position);
                if( moves < 4){
                    $('.stopP1, .stopP2').empty();
                    $('.stopP1').append($('<br/><input type="button" value="Fin du tour" id="buttonStopP1" action="#">'));
                    perso1.move(perso1);
                    possible(perso1.position);
                    $('#buttonStopP1').click(function(e){
                        moves = 0;
                        tour++;
                        $('.stopP1, .stopP2').empty();
                        possible(perso2.position);
                        return moves;
                    });
                };
            } else {
                p1Play = false;
                possible(perso2.position);
                if( moves < 4){
                    $('.stopP1, .stopP2').empty();
                    $('.stopP2').append($('<br/><input type="button" value="Fin du tour" id="buttonStopP2" action="#">'));
                    perso2.move(perso2);
                    possible(perso2.position);
                    $('#buttonStopP2').click(function(e){
                        moves = 0;
                        tour++;
                        $('.stopP1, .stopP2').empty();
                        possible(perso1.position);
                        return moves;
                    });
                }
            }
            //Tant que moves n'a pas atteint 3, on ne passe pas au tour suivant. 
            //Cela permet de limiter les déplacements.
            if(moves == 3){
                tour ++;
                moves = 0;
                if (tour%2 == 0){
                    possible(perso1.position);
                    $('.stopP2').empty();
                } else {
                    possible(perso2.position);
                    $('.stopP1').empty();
                }
            }; 
        return p1Play;
        };
    });
    //*****************************************GESTION DES COMBATS **********************************
//Essais de fonctions pour désactiver les boutons de combat au tour par tour
    //A factoriser
function disableP1(){
    $('.attackP1, .defendP1').hide();
    $('.attackP2, .defendP2').show();
    perso2.hasShield = false;
};

function disableP2(){
    $('.attackP2, .defendP2').hide();
    $('.attackP1, .defendP1').show();
    perso1.hasShield = false;
};
// Laisser le premier coup à l'attaquant
$('#showFightRing').click(function(e){
    $('#explain, #showFightRing').hide();
    $('#fightRing').fadeIn();
    if(p1Play == true){
        disableP2();
    } else if (p1Play == false){
        disableP1();
    };
});
    
//Ecoute des boutons P1
    $('.attackP1').click(function(e){
        p1Play = false;
        perso1.attaque(perso1, perso2);
        perso2.hasShield = false;
        disableP1();
    });
    $('.defendP1').click(function(e){
        p1Play = false;
        disableP1();
        perso1.hasShield = true;
    });
    //Ecoute des boutons P2
    $('.attackP2').click(function(e){
        p1Play = true;
        perso2.attaque(perso2, perso1);
        perso1.hasShield = false;
        disableP2();
    });
    $('.defendP2').click(function(e){
        disableP2();
        p1Play = true;
        perso2.hasShield = true;
    });
    



//*****************************GESTION DU CLIC SUR RELOAD************************************************
$('#reload').click(function(){
    $(document).on('keydown');
    perso1.newRound(perso1);
    perso2.newRound(perso2);
    tour = 0;
    moves = 0;
    $('.stopP1, .stopP2').empty();
    $('#masque, #reload').hide();
    //$("td, tr, table").remove();
    $('#explain, #showFightRing, .title').show();
});


  
});//Ne pas retirer, fin de la fonction de chargement du DOM
