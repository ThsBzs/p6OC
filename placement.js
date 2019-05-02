//*************************REMPLISSAGE DES CASES POUR LES RENDRE OCCUPEES**************************
//Remplissage de 10 cases au hasard avec une couleur de fond rouge pour devenir occupées 
$('#place').click(function(){
    $("td").css({'background-color': 'white', "background-image": "none"}).removeClass("occuped").addClass("free");//On remet tout en blanc avant de relancer
    for(i=0; i<= 9; i++){//Boucle sur 10 cases
        aGriser = (Math.floor(Math.random()*free.length));//Récupère un index au hasard dans le tableau
        $("td").eq(aGriser).css("background-color", "grey").removeClass("free").addClass("occuped");//Colore en rouge les cases dont l'index est celui récupéré
        /*let toRemove = $("td").eq(aGriser);
        updateFree(free, toRemove);*///Appel de mise à jour du tableau, ne marche pas
    };
    for(i=0; i<= 3; i++){
        aGriser =(Math.floor(Math.random()*free.length));//Récupère un index au hasard dans le tableau
        if ($("td").hasClass("free")){
        $("td").eq(aGriser).css("background-color", "red").removeClass("free").addClass("occuped");
        };
        /*let toRemove = $("td").eq(aGriser);
        updateFree(free, toRemove);*/
    };
    for(i=1; i<= 1; i++){
        aGriser = (Math.floor(Math.random()*free.length));//Récupère un index au hasard dans le tableau
        if ($("td").hasClass("free")){
        $("td").eq(aGriser).css("background-image", "url(images/lapinSmall.jpg)").removeClass("free").addClass("occuped");
        };
        /*let toRemove = $("td").eq(aGriser);
        updateFree(free, toRemove);*/
    };
    for(i=1; i<= 1; i++){
        aGriser = (Math.floor(Math.random()*free.length));//Récupère un index au hasard dans le tableau
        if ($("td").hasClass("free")){
        $("td").eq(aGriser).css("background-image", "url(images/minionSmall.png)").removeClass("free").addClass("occuped");
        };
        /*let toRemove = $("td").eq(aGriser);
        updateFree(free, toRemove);*/
    };
    
     
});
