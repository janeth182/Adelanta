import { useContext, useEffect } from "react";
import { ContentComponent } from "../components/layout/content";
import { AuthContext } from "../context/authProvider";
export const HomePage = () => {
	const { user } = useContext(AuthContext);
	useEffect(() => {
		if(!user) return;
		console.log(user);
	}, [user]);
	return (
		<ContentComponent>
				<h1>
				Sunt deserunt tempor sint esse excepteur sunt. Consectetur et
				consectetur ad ut. Aliqua consectetur sit est nisi duis. Proident
				irure et voluptate qui esse ea et ea aliqua officia amet dolore. Qui
				sit labore quis tempor. Lorem culpa dolore magna incididunt quis eu
				cillum ex dolor enim excepteur. Eiusmod incididunt id anim esse ea
				ut incididunt reprehenderit. Veniam anim commodo velit cupidatat ea
				exercitation incididunt nostrud do minim. Nulla ipsum sint tempor
				consectetur amet. Velit fugiat in exercitation nostrud occaecat
				ullamco nisi ea sit commodo anim cillum adipisicing. Incididunt
				exercitation consequat sit magna laborum dolore amet id duis. Cillum
				duis cupidatat velit esse aute elit. Velit cillum dolore occaecat
				exercitation. Deserunt velit exercitation labore ut fugiat anim
				consectetur reprehenderit sint ut aute adipisicing cillum aute.
				Laboris excepteur tempor laborum incididunt laboris anim cillum enim
				qui commodo adipisicing enim nostrud excepteur. Nulla dolor
				exercitation mollit deserunt duis non laboris eu esse id duis. Ut
				nulla laborum nulla officia et amet elit minim. Cupidatat nulla
				ullamco minim ex deserunt cupidatat et dolore qui ipsum. Cillum
				veniam incididunt voluptate id sunt cupidatat amet mollit nulla ad
				dolore. Voluptate nulla et mollit non exercitation irure.
				Reprehenderit exercitation dolor id elit incididunt ea reprehenderit
				reprehenderit sit mollit. Excepteur adipisicing excepteur excepteur
				laborum enim ut pariatur cillum dolore dolor excepteur consectetur.
				Magna nostrud ad occaecat ut veniam eiusmod enim cupidatat cupidatat
				ex tempor duis. Pariatur nulla reprehenderit anim nulla amet cillum
				mollit ad in ad mollit ipsum. Quis sit labore irure et irure magna
				officia eu est cillum excepteur magna ipsum. Incididunt sunt dolore
				commodo eiusmod labore sunt pariatur ad cupidatat pariatur excepteur
				velit. Velit fugiat ex commodo sint. Enim sit qui consequat nulla.
				Incididunt dolor consequat cupidatat dolore sint sunt aliquip ipsum
				labore reprehenderit veniam. Cillum esse excepteur ex tempor nulla
				ea fugiat. Laborum minim minim quis ad nostrud elit Lorem nostrud
				proident enim. Reprehenderit et ad eiusmod et commodo qui cillum
				quis aliqua eu ut cupidatat. Amet duis dolor excepteur occaecat
				ullamco reprehenderit. Sit reprehenderit tempor voluptate
				consectetur labore Lorem minim laboris. Elit quis nisi nulla ad
				nostrud nostrud pariatur et aliqua pariatur proident enim cupidatat.
				Proident deserunt ipsum non sunt eu. Sunt adipisicing officia est
				voluptate sunt labore ea nulla pariatur duis ad. Anim aliquip
				consectetur ullamco eu duis minim aliquip. Ad esse sit id sit labore
				reprehenderit laborum non non officia veniam. Labore nisi sit
				officia non reprehenderit veniam occaecat deserunt. Lorem qui non
				sint ipsum aute deserunt excepteur quis. Anim ad amet aliqua minim
				id. Nulla irure deserunt deserunt labore enim minim nostrud nisi
				anim ad do. Eu qui do aliquip id cillum exercitation nisi proident
				sint. Dolore cillum sit exercitation exercitation commodo anim ea
				sit laborum occaecat tempor. Do eiusmod id ullamco labore pariatur
				in tempor. Anim occaecat duis exercitation tempor quis magna aute.
				Minim mollit id sit aliquip incididunt duis irure aliquip.
			</h1>		
		</ContentComponent>
	);
};
