
export default function({ route, redirect, store }) {
	if(route.path == '/'){
		redirect('/discover/recommend')
	}
}
