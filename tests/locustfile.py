from locust import FastHttpUser, between, task


class WebsiteUser(FastHttpUser):

    connection_timeout = 5.0
    network_timeout = 5.0
    
    @task
    def docs(self):
        self.client.get("/docs")
        
    @task
    def events(self):
        self.client.get("/api/v1/events")
    
    @task
    def events_id(self):
        self.client.get("/api/v1/events/2223")
    
    @task
    def speakers(self):
        self.client.get("/api/v1/speakers")
    
    @task
    def speakers_id(self):
        self.client.get("/api/v1/speakers/2713")
    
    @task
    def posts(self):
        self.client.get("/api/v1/posts")
    
    @task
    def posts_id(self):
        self.client.get("/api/v1/posts/3231")