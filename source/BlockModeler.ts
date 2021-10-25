namespace BlockModeler {
	type BoxVertexes = [number, number, number, number, number, number];

	export function getRotatedBoxVertexes(box: BoxVertexes, rotation: number): BoxVertexes {
		switch (rotation) {
		case 0:
			return box;
		case 1:
			return [1 - box[3], box[1], 1 - box[5], 1 - box[0], box[4], 1 - box[2]]; // rotate 180°
		case 2:
			return [box[2], box[1], 1 - box[3], box[5], box[4], 1 - box[0]]; // rotate 270°
		case 3:
			return [1 - box[5], box[1], box[0], 1 - box[2], box[4], box[3]] // rotate 90°
		}
	}

	export function setStairsRenderModel(id: number) {
		const boxes: BoxVertexes[] = [
			[0, 0, 0, 1, 0.5, 1],
			[0.5, 0.5, 0.5, 1, 1, 1],
			[0, 0.5, 0.5, 0.5, 1, 1],
			[0.5, 0.5, 0, 1, 1, 0.5],
			[0, 0.5, 0, 0.5, 1, 0.5]
		]
		createStairsRenderModel(id, 0, boxes);
		const newBoxes = [];
		for (let box of boxes) {
			newBoxes.push([box[0], 1 - box[4], box[2], box[3], 1 - box[1], box[5]]);
		}
		createStairsRenderModel(id, 4, newBoxes);
	}

	export function createStairsRenderModel(id: number, startData: number, boxes: BoxVertexes[]) {
		const modelConditionData = [
			{data: 3, posR: [-1, 0], posB: [0, 1]},
			{data: 2, posR: [1, 0], posB: [0, -1]},
			{data: 0, posR: [0, 1], posB: [1, 0]},
			{data: 1, posR: [0, -1], posB: [-1, 0]}
		]

		for (let i = 0; i < 4; i++) {
			const conditionData = modelConditionData[i];
			const data = startData + i;
			const rBlockData = conditionData.data + startData;
			const groupR = ICRender.getGroup("stairs:" + rBlockData);
			const groupL = ICRender.getGroup("stairs:" + (rBlockData^1));
			const currentGroup = ICRender.getGroup("stairs:"+data);
			currentGroup.add(id, data);

			const render = new ICRender.Model();
			const shape = new ICRender.CollisionShape();

			const box0 = boxes[0];
			render.addEntry(new BlockRenderer.Model(box0[0], box0[1], box0[2], box0[3], box0[4], box0[5], id, data)); // slabe box
			shape.addEntry().addBox(box0[0], box0[1], box0[2], box0[3], box0[4], box0[5]);

			const posR = conditionData.posR; // right block
			const posB = conditionData.posB; // back block
			const posF = [posB[0]*(-1), posB[1]*(-1)]; // front block
			const conditionRight = ICRender.BLOCK(posR[0], 0, posR[1], currentGroup, false);
			const conditionLeft = ICRender.BLOCK(posR[0]*(-1), 0, posR[1]*(-1), currentGroup, false);
			const conditionBackNotR = ICRender.BLOCK(posB[0], 0, posB[1], groupR, true);
			const conditionBackNotL = ICRender.BLOCK(posB[0], 0, posB[1], groupL, true);
			const box1 = getRotatedBoxVertexes(boxes[1], i);
			let model = new BlockRenderer.Model(box1[0], box1[1], box1[2], box1[3], box1[4], box1[5], id, data);
			const condition0 = ICRender.OR(conditionBackNotR, conditionLeft);
			render.addEntry(model).setCondition(condition0);
			shape.addEntry().addBox(box1[0], box1[1], box1[2], box1[3], box1[4], box1[5]).setCondition(condition0);

			const box2 = getRotatedBoxVertexes(boxes[2], i);
			const condition1 = ICRender.OR(conditionBackNotL, conditionRight);
			model = new BlockRenderer.Model(box2[0], box2[1], box2[2], box2[3], box2[4], box2[5], id, data);
			render.addEntry(model).setCondition(condition1);
			shape.addEntry().addBox(box2[0], box2[1], box2[2], box2[3], box2[4], box2[5]).setCondition(condition1);

			const box3 = getRotatedBoxVertexes(boxes[3], i);
			model = new BlockRenderer.Model(box3[0], box3[1], box3[2], box3[3], box3[4], box3[5], id, data);
			const condition2 = ICRender.AND(conditionBackNotR, conditionBackNotL, ICRender.NOT(conditionLeft), ICRender.BLOCK(posF[0], 0, posF[1], groupL, false));
			render.addEntry(model).setCondition(condition2);
			shape.addEntry().addBox(box3[0], box3[1], box3[2], box3[3], box3[4], box3[5]).setCondition(condition2);

			const box4 = getRotatedBoxVertexes(boxes[4], i);
			model = new BlockRenderer.Model(box4[0], box4[1], box4[2], box4[3], box4[4], box4[5], id, data);
			const condition3 = ICRender.AND(conditionBackNotR, conditionBackNotL, ICRender.NOT(conditionRight), ICRender.BLOCK(posF[0], 0, posF[1], groupR, false));
			render.addEntry(model).setCondition(condition3);
			shape.addEntry().addBox(box4[0], box4[1], box4[2], box4[3], box4[4], box4[5]).setCondition(condition3);

			BlockRenderer.setStaticICRender(id, data, render);
			BlockRenderer.setCustomCollisionShape(id, data, shape);
			BlockRenderer.setCustomRaycastShape(id, data, shape);
		}
	}

	export function setInventoryModel(blockID: number, model: RenderMesh | ICRender.Model | BlockRenderer.Model, data: number = -1): void {
		ItemModel.getFor(blockID, data).setHandModel(model);
		ItemModel.getFor(blockID, data).setUiModel(model);
	}
}