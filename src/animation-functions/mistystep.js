async function mistyStep(handler) {

	//DAE Macro Execute, Effect Value = "Macro Name" @token 
	let actor = handler.actor;
	const token = handler.actorToken;
	const folder01 = "imports/custom_spellfx/";
	//anFile is the name of the file used fRedhe animation

	//seed is the animation to play.  Can be overwritten to a single color by setting seed to a specific number.
	let seed = Math.floor(Math.random() * 2) + 1;

	let anFile1 = `${folder01}MistyStep_01_Purple.webm`;
	let anFile2 = `${folder01}MistyStep_02_Purple.webm`;

	let anDeg;
	let ray;
	let tok;
	let myScale = canvas.grid.size / 100 * .6;
	const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

		let range = MeasuredTemplate.create({
			t: "circle",
			user: game.user._id,
			x: token.x + canvas.grid.size / 2,
			y: token.y + canvas.grid.size / 2,
			direction: 0,
			distance: 30,

			borderColor: "#FF0000",
			flags: {
				DAESRD: {
					MistyStep: {
						ActorId: actor.id
					}
				}
			}

		});

		range.then(result => {
			let templateData = {
				t: "rect",
				user: game.user._id,
				distance: 7.5,
				direction: 45,
				x: 0,
				y: 0,
				fillColor: game.user.color,
				flags: {
					DAESRD: {
						MistyStep: {
							ActorId: actor.id
						}
					}
				}
			};



			Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);

			let template = new game.dnd5e.canvas.AbilityTemplate(templateData);
			template.actorSheet = actor.sheet;
			template.drawPreview();

			async function deleteTemplatesAndMove(scene, template) {

				let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.MistyStep?.ActorId === actor.id);


				tok = token
				if (tok != undefined) {

					ray = new Ray(tok.center, { x: template.x + canvas.grid.size / 2, y: template.y + canvas.grid.size / 2 });
					// Determines the angle
					anDeg = -(ray.angle * 57.3) - 90;

					const data = {
						file: anFile1,
						position: tok.center,
						anchor: {
							x: .5,
							y: .5
						},
						angle: anDeg,
						speed: 0,
						scale: {
							x: myScale,
							y: myScale
						}
					}

					canvas.fxmaster.playVideo(data);
					game.socket.emit('module.fxmaster', data);

				}

				tok.update({ "hidden": !tok.data.hidden })
				await token.update({ x: template.x, y: template.y}, {animate: false})
				await wait(1500);

				if (tok != undefined) {

					anDeg = -(ray.angle * 57.3) - 90;



					const data2 = {
						file: anFile2,
						position: {
							x: template.x + canvas.grid.size / 2,
							y: template.y + canvas.grid.size / 2
						},
						anchor: {
							x: .5,
							y: .5
						},
						angle: anDeg,
						speed: 0,
						scale: {
							x: -myScale,
							y: -myScale
						}
					}

					canvas.fxmaster.playVideo(data2);
					game.socket.emit('module.fxmaster', data2);

				}

				await canvas.templates.deleteMany([removeTemplates[0].id, removeTemplates[1].id]);
				//await actor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
				await wait(1200);
				tok.update({ "hidden": !tok.data.hidden })

			};
		});
}
export default mistyStep;