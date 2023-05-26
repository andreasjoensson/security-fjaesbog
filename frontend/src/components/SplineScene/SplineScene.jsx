import useSpline from "@splinetool/r3f-spline";
import { PerspectiveCamera } from "@react-three/drei";

export default function SplineScene({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/1KwjD8o3su0l8OSC/scene.splinecode"
  );
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <group {...props} dispose={null}>
        <group
          name="Pass 4"
          position={[0, 0, 0]}
          rotation={[-0.21, -Math.PI / 10, -0.07]}
          scale={1}
        >
          <group name="bracing" position={[-0.53, 268.35, -3.07]}>
            <mesh
              name="Sphere"
              geometry={nodes.Sphere.geometry}
              material={materials["Sphere Material"]}
              castShadow
              receiveShadow
              position={[0.53, 28.31, 2.5]}
              rotation={[0, 0, 0]}
              scale={[1.11, 1.11, 0.23]}
            />
            <mesh
              name="Ellipse"
              geometry={nodes.Ellipse.geometry}
              material={materials["Ellipse Material"]}
              castShadow
              receiveShadow
              position={[-0.05, 27.28, -7.65]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
            <mesh
              name="Cube"
              geometry={nodes.Cube.geometry}
              material={materials[""]}
              castShadow
              receiveShadow
              position={[0, -57.24, -0.6]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
          </group>
          <mesh
            name="Sticker"
            geometry={nodes.Sticker.geometry}
            material={materials["Sticker Material"]}
            castShadow
            receiveShadow
            position={[-99.16, -158.91, 12.81]}
            rotation={[0.02, 0, 0]}
          />
          <mesh
            name="Lamination"
            geometry={nodes.Lamination.geometry}
            material={materials[""]}
            castShadow
            receiveShadow
            position={[0, 1.53, 0]}
          />
          <mesh
            name="Card (PLACE YOUR IMAGE) 2"
            geometry={nodes["Card (PLACE YOUR IMAGE) 2"].geometry}
            material={materials["Card (PLACE YOUR IMAGE) 2 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, 0]}
          />
          <mesh
            name="Card other side(PLACE YOUR IMAGE)"
            geometry={nodes["Card other side(PLACE YOUR IMAGE)"].geometry}
            material={materials["Card other side(PLACE YOUR IMAGE) Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, -2.1]}
          />
        </group>
        <group
          name="Pass 3"
          position={[371, -7, 0]}
          rotation={[-0.21, -Math.PI / 10, -0.07]}
          scale={1}
        >
          <group name="bracing1" position={[-0.53, 268.35, -3.07]}>
            <mesh
              name="Sphere1"
              geometry={nodes.Sphere1.geometry}
              material={materials["Sphere1 Material"]}
              castShadow
              receiveShadow
              position={[0.53, 28.31, 2.5]}
              rotation={[0, 0, 0]}
              scale={[1.11, 1.11, 0.23]}
            />
            <mesh
              name="Ellipse1"
              geometry={nodes.Ellipse1.geometry}
              material={materials["Ellipse1 Material"]}
              castShadow
              receiveShadow
              position={[-0.05, 27.28, -7.65]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
            <mesh
              name="Cube1"
              geometry={nodes.Cube1.geometry}
              material={materials[""]}
              castShadow
              receiveShadow
              position={[0, -57.24, -0.6]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
          </group>
          <mesh
            name="Sticker1"
            geometry={nodes.Sticker1.geometry}
            material={materials["Sticker1 Material"]}
            castShadow
            receiveShadow
            position={[-99.16, -158.91, 12.81]}
            rotation={[0.02, 0, 0]}
          />
          <mesh
            name="Lamination1"
            geometry={nodes.Lamination1.geometry}
            material={materials[""]}
            castShadow
            receiveShadow
            position={[0, 1.53, 0]}
          />
          <mesh
            name="Card (PLACE YOUR IMAGE) 21"
            geometry={nodes["Card (PLACE YOUR IMAGE) 21"].geometry}
            material={materials["Card (PLACE YOUR IMAGE) 21 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, 0]}
          />
          <mesh
            name="Card other side(PLACE YOUR IMAGE)1"
            geometry={nodes["Card other side(PLACE YOUR IMAGE)1"].geometry}
            material={materials["Card other side(PLACE YOUR IMAGE)1 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, -2.1]}
          />
        </group>
        <group
          name="Pass 2"
          position={[-333, 21, 0]}
          rotation={[-0.21, -Math.PI / 10, -0.07]}
          scale={1}
        >
          <group name="bracing2" position={[-0.53, 268.35, -3.07]}>
            <mesh
              name="Sphere2"
              geometry={nodes.Sphere2.geometry}
              material={materials["Sphere2 Material"]}
              castShadow
              receiveShadow
              position={[0.53, 28.31, 2.5]}
              rotation={[0, 0, 0]}
              scale={[1.11, 1.11, 0.23]}
            />
            <mesh
              name="Ellipse2"
              geometry={nodes.Ellipse2.geometry}
              material={materials["Ellipse2 Material"]}
              castShadow
              receiveShadow
              position={[-0.05, 27.28, -7.65]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
            <mesh
              name="Cube2"
              geometry={nodes.Cube2.geometry}
              material={materials[""]}
              castShadow
              receiveShadow
              position={[0, -57.24, -0.6]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
          </group>
          <mesh
            name="Sticker2"
            geometry={nodes.Sticker2.geometry}
            material={materials["Sticker2 Material"]}
            castShadow
            receiveShadow
            position={[-99.16, -158.91, 12.81]}
            rotation={[0.02, 0, 0]}
          />
          <mesh
            name="Lamination2"
            geometry={nodes.Lamination2.geometry}
            material={materials[""]}
            castShadow
            receiveShadow
            position={[0, 1.53, 0]}
          />
          <mesh
            name="Card (PLACE YOUR IMAGE) 22"
            geometry={nodes["Card (PLACE YOUR IMAGE) 22"].geometry}
            material={materials["Card (PLACE YOUR IMAGE) 22 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, 0]}
          />
          <mesh
            name="Card other side(PLACE YOUR IMAGE)2"
            geometry={nodes["Card other side(PLACE YOUR IMAGE)2"].geometry}
            material={materials["Card other side(PLACE YOUR IMAGE)2 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, -2.1]}
          />
        </group>
        <group
          name="Pass"
          position={[0, 0, 0]}
          rotation={[-0.21, -Math.PI / 10, -0.07]}
          scale={1}
        >
          <group name="bracing3" position={[-0.53, 268.35, -3.07]}>
            <mesh
              name="Sphere3"
              geometry={nodes.Sphere3.geometry}
              material={materials["Sphere3 Material"]}
              castShadow
              receiveShadow
              position={[0.53, 28.31, 2.5]}
              rotation={[0, 0, 0]}
              scale={[1.11, 1.11, 0.23]}
            />
            <mesh
              name="Ellipse3"
              geometry={nodes.Ellipse3.geometry}
              material={materials["Ellipse3 Material"]}
              castShadow
              receiveShadow
              position={[-0.05, 27.28, -7.65]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
            <mesh
              name="Cube3"
              geometry={nodes.Cube3.geometry}
              material={materials[""]}
              castShadow
              receiveShadow
              position={[0, -57.24, -0.6]}
              rotation={[0, 0, 0]}
              scale={1.11}
            />
          </group>
          <mesh
            name="Sticker3"
            geometry={nodes.Sticker3.geometry}
            material={materials["Sticker3 Material"]}
            castShadow
            receiveShadow
            position={[-99.16, -158.91, 12.81]}
            rotation={[0.02, 0, 0]}
          />
          <mesh
            name="Lamination3"
            geometry={nodes.Lamination3.geometry}
            material={materials[""]}
            castShadow
            receiveShadow
            position={[0, 1.53, 0]}
          />
          <mesh
            name="Card (PLACE YOUR IMAGE) 23"
            geometry={nodes["Card (PLACE YOUR IMAGE) 23"].geometry}
            material={materials["Card (PLACE YOUR IMAGE) 23 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, 0]}
          />
          <mesh
            name="Card other side(PLACE YOUR IMAGE)3"
            geometry={nodes["Card other side(PLACE YOUR IMAGE)3"].geometry}
            material={materials["Card other side(PLACE YOUR IMAGE)3 Material"]}
            castShadow
            receiveShadow
            position={[0, -17.28, -2.1]}
          />
        </group>
        <PerspectiveCamera
          name="1"
          makeDefault={true}
          far={100000}
          near={70}
          fov={45}
          position={[0, 0, 1227.74]}
          rotation={[0, 0, 0]}
        />
        <hemisphereLight
          name="Default Ambient Light"
          intensity={0.5}
          color="#eaeaea"
        />
      </group>
    </>
  );
}
