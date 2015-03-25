export default function(){
  this.transition(
    this.fromRoute("create.index"),
    this.toRoute("create.crop"),
    this.use("morph", {
      css: {
        backgroundColor: "#fff"
      }
    })
  );

  this.transition(
    this.fromRoute("create.crop"),
    this.toRoute("create.index"),
    this.use("morph", {
      css: {
        zoom: 2
      }
    })
  );

  this.transition(
    this.fromRoute("create.crop"),
    this.toRoute("create.scene"),
    this.use("crossFade"),
    this.reverse("crossFade")
  );

  this.transition(
    this.toRoute("watch"),
    this.use("crossFade")
  );

  this.transition(
    this.fromRoute("watch"),
    this.use("crossFade")
  );
};