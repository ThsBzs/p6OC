export class Perso {//Création d'une classe personnage
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
    //Méthode de mise à jour à la fin d'une partie
    newRound(){
        this.alive = true;
        this.hp = 100;
        this.degats = 10;
        this.arme = "Aucune";
        this.hasWeapon = false;
        this.weaponClass = "";
        this.weaponAvatar = "";
        this.hasShield = false;
    };
    //Méthode d'attaque
    attaque(attaquant, cible){
        function die(cible){//Fonction de mort du perso si les dégâts subis dépassent les hp
            cible.hasShield = false;
            cible.hp = 0;
            cible.alive = false;
            attaquant.score ++;
            refresh();
        }
        if (cible.hasShield == false) {//Si le bouclier n'est pas utilisé, dégâts 100%
            if((cible.hp - attaquant.degats) > 0 ){//Si les dégâts infligés ne diminuent pas la vie en-dessous de 0
                cible.hp -= attaquant.degats;//On inflige les dégâts
                refresh();//Rafraîchissement des deux persos
            } else if ((cible.hp - attaquant.degats) <= 0 ){//Si les dégâts font basculer en négatif
                die(cible);
            }
        } else {//Si le bouclier est utilisé, on divise les dégâts reçus par 2
            if((cible.hp - (attaquant.degats / 2)) > 0 ){
                cible.hp -= (attaquant.degats / 2); 
                cible.hasShield == false;
                refresh();
            } else if ((cible.hp - (attaquant.degats / 2)) <= 0 ){
                die(cible);
            }
        };
        cible.hasShield = false;//Après l'attaque, on retire le bouclier
    };
    //Méthode de récupération d'arme
    addWeapon(weapon, classe){
        if(this.position == weapon.position){
            //On vérifie si le joueur avait une arme. Si oui, on dépose l'ancienne sur le plateau.
            if(this.hasWeapon == true){
                $('td').eq(this.position).addClass(this.weaponClass).removeClass("free");
            };
            //On réinitialise les dégâts de base
            this.degats = 10;
            //On ajoute les infos de l'arme au perso
            this.arme = weapon.nom;
            this.degats += weapon.degats;
            this.weaponClass = weapon.classe;
            this.weaponAvatar = weapon.avatar;
            //On retire l'arme de la case 
            $('td').eq(weapon.position).removeClass(classe);
            //On met à jour le hasWeapon sur vrai
            this.hasWeapon = true;
        };
    };
    
//Méthode de déplacement n'utilisant pas de paramètre 
    move(perso){
        //Suppression du css pour retirer l'image
        function remove(position, classe){
            $("td").eq(position).removeAttr("style").removeClass(classe).addClass("free");
        };
        //Fonction pour basculer en combat
        function checkFight(value1, value2){
            let arrFight = [value2 + 10, value2-10, value2+1, value2-1];//Préparation d'un tableau des cases proches
            if (arrFight.includes(value1)//Si la position du perso est dans ce tableau
            ){
                inFight = true;//Permet de bloquer les déplacements lors d'un combat
                $('#masque').fadeIn();
                $('#fightRing').hide();
            }
            return inFight;
        };
        //Préparation des fonctions up et down
        const droite  = +1,
              gauche = -1,
              haut = -10,
              bas = +10; 
        function movePlayer(value){
            if ((!$('td').eq(perso.position + value).hasClass("occuped")) && //Si on ne cherche pas à atteindre une case grise
                    (!$('td').eq(perso.position + value).hasClass("P1")) &&//Et si on n'essaie pas d'aller SUR un perso
                    (!$('td').eq(perso.position + value).hasClass("P2")) 
                ){
                    remove(perso.position, perso.classe);//Retire l'image avec la fonction remove()
                    perso.position = perso.position + value;//Met à jour la position en lui donnant en valeur celle passée en paramètre +1
                    addImage(perso.position, perso.avatar, perso.classe);//Ajoute, via la fonction addImage, le CSS.
                    refreshPos();//Met à jour le tableau des positions.
                    checkFight(perso1.position, perso2.position);//Vérifie si les deux persos sont côte-à-côte
                    moves ++;
                };
        };
        switch(dir){
            case 39 : //Droite
                if (arrayRight.indexOf(this.position) == -1){//Si la position actuelle n'est pas une bordure droite 
                    movePlayer(droite);//on peut se déplacer vers la droite
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
        };
};