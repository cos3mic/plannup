package planup.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import planup.backend.model.*;
import planup.backend.repository.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;
    private final EpicRepository epicRepository;
    private final ActivityRepository activityRepository;
    private final NotificationRepository notificationRepository;
    private final IdeaRepository ideaRepository;
    private final RetrospectiveRepository retrospectiveRepository;
    private final WorkflowRepository workflowRepository;
    private final TemplateRepository templateRepository;
    private final RoleRepository roleRepository;
    private final ComponentRepository componentRepository;

    public DataInitializer(UserRepository userRepository,
                          OrganizationRepository organizationRepository,
                          ProjectRepository projectRepository,
                          SprintRepository sprintRepository,
                          IssueRepository issueRepository,
                          EpicRepository epicRepository,
                          ActivityRepository activityRepository,
                          NotificationRepository notificationRepository,
                          IdeaRepository ideaRepository,
                          RetrospectiveRepository retrospectiveRepository,
                          WorkflowRepository workflowRepository,
                          TemplateRepository templateRepository,
                          RoleRepository roleRepository,
                          ComponentRepository componentRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.sprintRepository = sprintRepository;
        this.issueRepository = issueRepository;
        this.epicRepository = epicRepository;
        this.activityRepository = activityRepository;
        this.notificationRepository = notificationRepository;
        this.ideaRepository = ideaRepository;
        this.retrospectiveRepository = retrospectiveRepository;
        this.workflowRepository = workflowRepository;
        this.templateRepository = templateRepository;
        this.roleRepository = roleRepository;
        this.componentRepository = componentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no data exists
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
        // Create sample users
        User user1 = new User();
        user1.setId("user-1");
        user1.setClerkId("clerk_user_1");
        user1.setEmail("john.doe@company.com");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setFullName("John Doe");
        user1.setAvatar("JD");
        user1.setCreatedAt(new Date());
        user1.setUpdatedAt(new Date());
        user1.setActive(true);
        user1.setOrganizationIds(Arrays.asList("org-1"));
        user1.setProjectIds(Arrays.asList("project-1", "project-2"));
        user1.setRole("admin");
        user1.setPermissions(Arrays.asList("manage-project", "create-issues", "edit-issues"));

        User user2 = new User();
        user2.setId("user-2");
        user2.setClerkId("clerk_user_2");
        user2.setEmail("alice.smith@company.com");
        user2.setFirstName("Alice");
        user2.setLastName("Smith");
        user2.setFullName("Alice Smith");
        user2.setAvatar("AS");
        user2.setCreatedAt(new Date());
        user2.setUpdatedAt(new Date());
        user2.setActive(true);
        user2.setOrganizationIds(Arrays.asList("org-1"));
        user2.setProjectIds(Arrays.asList("project-1"));
        user2.setRole("developer");
        user2.setPermissions(Arrays.asList("create-issues", "edit-issues"));

        userRepository.saveAll(Arrays.asList(user1, user2));

        // Create sample organization
        Organization org1 = new Organization();
        org1.setId("org-1");
        org1.setName("Demo Org Alpha");
        org1.setDescription("A demo organization for testing");
        org1.setColor("#FF6B6B");
        org1.setMemberIds(Arrays.asList("user-1", "user-2"));
        org1.setOwnerId("user-1");
        org1.setCreatedAt(new Date());
        org1.setUpdatedAt(new Date());
        org1.setActive(true);
        org1.setProjectIds(Arrays.asList("project-1", "project-2"));

        organizationRepository.save(org1);

        // Create sample projects
        Project project1 = new Project();
        project1.setId("project-1");
        project1.setName("Mobile App Development");
        project1.setKey("MAD");
        project1.setDescription("Complete mobile app development project");
        project1.setColor("#FF6B6B");
        project1.setLeadId("user-1");
        project1.setOrganizationId("org-1");
        project1.setProgress(75);
        project1.setIssueCount(24);
        project1.setMemberIds(Arrays.asList("user-1", "user-2"));
        project1.setCreatedAt(new Date());
        project1.setUpdatedAt(new Date());
        project1.setActive(true);

        Project project2 = new Project();
        project2.setId("project-2");
        project2.setName("Website Redesign");
        project2.setKey("WRD");
        project2.setDescription("Website redesign and UI/UX improvements");
        project2.setColor("#4ECDC4");
        project2.setLeadId("user-1");
        project2.setOrganizationId("org-1");
        project2.setProgress(45);
        project2.setIssueCount(18);
        project2.setMemberIds(Arrays.asList("user-1"));
        project2.setCreatedAt(new Date());
        project2.setUpdatedAt(new Date());
        project2.setActive(true);

        projectRepository.saveAll(Arrays.asList(project1, project2));

        // Create sample sprints
        Sprint sprint1 = new Sprint();
        sprint1.setId("sprint-1");
        sprint1.setName("Sprint 23");
        sprint1.setStartDate(new Date());
        sprint1.setEndDate(new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000));
        sprint1.setStatus("active");
        sprint1.setGoal("Complete mobile app authentication and dashboard features");
        sprint1.setIssues(Arrays.asList("issue-1", "issue-2"));
        sprint1.setVelocity(85);
        sprint1.setCapacity(100);
        sprint1.setTeamMembers(Arrays.asList("John Doe", "Alice Smith"));

        Sprint sprint2 = new Sprint();
        sprint2.setId("sprint-2");
        sprint2.setName("Sprint 22");
        sprint2.setStartDate(new Date(System.currentTimeMillis() - 14 * 24 * 60 * 60 * 1000));
        sprint2.setEndDate(new Date(System.currentTimeMillis() - 1 * 24 * 60 * 60 * 1000));
        sprint2.setStatus("completed");
        sprint2.setGoal("Implement core API endpoints and database schema");
        sprint2.setIssues(Arrays.asList("issue-3"));
        sprint2.setVelocity(92);
        sprint2.setCapacity(100);
        sprint2.setTeamMembers(Arrays.asList("John Doe", "Alice Smith"));

        sprintRepository.saveAll(Arrays.asList(sprint1, sprint2));

        // Create sample epics
        Epic epic1 = new Epic();
        epic1.setId("epic-1");
        epic1.setKey("MAD-EPIC-1");
        epic1.setTitle("Mobile App Authentication & Dashboard");
        epic1.setDescription("Complete implementation of user authentication system and comprehensive dashboard features");
        epic1.setProjectId("project-1");
        epic1.setStatus("In Progress");
        epic1.setAssigneeId("user-1");
        epic1.setCreated(new Date());
        epic1.setUpdated(new Date());
        epic1.setDueDate(new Date(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000));
        epic1.setStoryPoints(21);
        epic1.setCompletedStoryPoints(8);
        epic1.setIssueIds(Arrays.asList("issue-1", "issue-2"));
        epic1.setColor("#FF6B6B");
        epic1.setLabels(Arrays.asList("authentication", "dashboard", "mobile"));
        epic1.setActive(true);

        epicRepository.save(epic1);

        // Create sample issues
        Issue issue1 = new Issue();
        issue1.setId("issue-1");
        issue1.setKey("MAD-1");
        issue1.setTitle("Fix login authentication bug");
        issue1.setDescription("Users are experiencing authentication failures when logging in with valid credentials");
        issue1.setProjectId("project-1");
        issue1.setPriority("High");
        issue1.setStatus("In Progress");
        issue1.setType("Bug");
        issue1.setAssigneeId("user-1");
        issue1.setReporterId("user-2");
        issue1.setCreated(new Date());
        issue1.setUpdated(new Date());
        issue1.setDueDate(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));
        issue1.setEstimatedHours(8);
        issue1.setLoggedHours(4);
        issue1.setStoryPoints(5);
        issue1.setLabels(Arrays.asList("authentication", "critical"));
        issue1.setComponents(Arrays.asList("frontend", "backend"));
        issue1.setEpicId("epic-1");
        issue1.setSprintId("sprint-1");
        issue1.setComments(Arrays.asList());
        issue1.setAttachments(Arrays.asList());
        issue1.setTimeLogs(Arrays.asList());
        issue1.setDecisionLog(Arrays.asList());
        issue1.setSubTaskIds(Arrays.asList());
        issue1.setLinkedIssueIds(Arrays.asList());
        issue1.setColor("#FF6B6B");
        issue1.setActive(true);

        Issue issue2 = new Issue();
        issue2.setId("issue-2");
        issue2.setKey("MAD-2");
        issue2.setTitle("Implement user dashboard");
        issue2.setDescription("Create a comprehensive dashboard for users to view their projects and tasks");
        issue2.setProjectId("project-1");
        issue2.setPriority("Medium");
        issue2.setStatus("To Do");
        issue2.setType("Story");
        issue2.setAssigneeId("user-2");
        issue2.setReporterId("user-1");
        issue2.setCreated(new Date());
        issue2.setUpdated(new Date());
        issue2.setDueDate(new Date(System.currentTimeMillis() + 14 * 24 * 60 * 60 * 1000));
        issue2.setEstimatedHours(16);
        issue2.setLoggedHours(0);
        issue2.setStoryPoints(8);
        issue2.setLabels(Arrays.asList("dashboard", "ui"));
        issue2.setComponents(Arrays.asList("frontend"));
        issue2.setEpicId("epic-1");
        issue2.setSprintId("sprint-1");
        issue2.setComments(Arrays.asList());
        issue2.setAttachments(Arrays.asList());
        issue2.setTimeLogs(Arrays.asList());
        issue2.setDecisionLog(Arrays.asList());
        issue2.setSubTaskIds(Arrays.asList());
        issue2.setLinkedIssueIds(Arrays.asList());
        issue2.setColor("#4ECDC4");
        issue2.setActive(true);

        issueRepository.saveAll(Arrays.asList(issue1, issue2));

        // Create sample activities
        Activity activity1 = new Activity();
        activity1.setId("activity-1");
        activity1.setType("issue_created");
        activity1.setTitle("New issue \"Fix login authentication bug\" created");
        activity1.setDescription("Issue created with high priority");
        activity1.setTimestamp(new Date());
        activity1.setIcon("create");
        activity1.setColor("#FF6B6B");
        activity1.setUserId("user-2");
        activity1.setProjectId("project-1");
        activity1.setIssueId("issue-1");
        activity1.setOrganizationId("org-1");
        activity1.setActive(true);

        Activity activity2 = new Activity();
        activity2.setId("activity-2");
        activity2.setType("issue_moved");
        activity2.setTitle("Issue \"Fix login authentication bug\" moved to In Progress");
        activity2.setDescription("Issue status updated to In Progress");
        activity2.setTimestamp(new Date(System.currentTimeMillis() - 2 * 60 * 60 * 1000));
        activity2.setIcon("checkmark-circle");
        activity2.setColor("#4CAF50");
        activity2.setUserId("user-1");
        activity2.setProjectId("project-1");
        activity2.setIssueId("issue-1");
        activity2.setOrganizationId("org-1");
        activity2.setActive(true);

        activityRepository.saveAll(Arrays.asList(activity1, activity2));

        // Create sample notifications
        Notification notification1 = new Notification();
        notification1.setId("notification-1");
        notification1.setType("issue_assigned");
        notification1.setTitle("Issue assigned to you");
        notification1.setMessage("You have been assigned to \"Fix login authentication bug\"");
        notification1.setUserId("user-1");
        notification1.setProjectId("project-1");
        notification1.setIssueId("issue-1");
        notification1.setOrganizationId("org-1");
        notification1.setCreatedAt(new Date());
        notification1.setRead(false);
        notification1.setIcon("person-add");
        notification1.setColor("#FF6B6B");
        notification1.setActive(true);

        notificationRepository.save(notification1);

        // Create sample ideas
        Idea idea1 = new Idea();
        idea1.setId("idea-1");
        idea1.setTitle("Automated Sprint Retrospective");
        idea1.setDescription("A feature to collect feedback and lessons learned during the sprint, not just at the end");
        idea1.setStatus("New");
        idea1.setUpvotes(3);
        idea1.setAuthorId("user-1");
        idea1.setCreatedAt(new Date());
        idea1.setUpdatedAt(new Date());
        idea1.setComments(Arrays.asList());
        idea1.setPromotedByIds(Arrays.asList());
        idea1.setOrganizationId("org-1");
        idea1.setProjectId("project-1");
        idea1.setActive(true);

        ideaRepository.save(idea1);

        // Create sample retrospectives
        Retrospective retro1 = new Retrospective();
        retro1.setId("retro-1");
        retro1.setType("Went Well");
        retro1.setText("Daily standups are concise and helpful");
        retro1.setAuthorId("user-1");
        retro1.setCreatedAt(new Date());
        retro1.setResolved(false);
        retro1.setOrganizationId("org-1");
        retro1.setProjectId("project-1");
        retro1.setSprintId("sprint-1");
        retro1.setActive(true);

        retrospectiveRepository.save(retro1);

        // Create sample workflows
        Workflow workflow1 = new Workflow();
        workflow1.setId("workflow-1");
        workflow1.setName("Agile Workflow");
        workflow1.setDescription("Standard agile workflow with To Do → In Progress → Done");
        workflow1.setStatuses(Arrays.asList("To Do", "In Progress", "Done"));
        workflow1.setTransitions(Arrays.asList());
        workflow1.setColor("#4CAF50");
        workflow1.setProjectId("project-1");
        workflow1.setOrganizationId("org-1");
        workflow1.setCreatedAt(new Date());
        workflow1.setUpdatedAt(new Date());
        workflow1.setActive(true);
        workflow1.setDefault(true);

        workflowRepository.save(workflow1);

        // Create sample templates
        Template template1 = new Template();
        template1.setId("template-1");
        template1.setName("Bug Report");
        template1.setDescription("Standard template for reporting bugs");
        template1.setIcon("bug");
        template1.setColor("#FF6B6B");
        template1.setFields(java.util.Map.of(
            "title", "Bug: [Brief description]",
            "description", "## Bug Description\n[Describe the bug in detail]",
            "type", "Bug",
            "priority", "High",
            "labels", "bug,needs-investigation"
        ));
        template1.setProjectId("project-1");
        template1.setOrganizationId("org-1");
        template1.setCreatedById("user-1");
        template1.setCreatedAt(new Date());
        template1.setUpdatedAt(new Date());
        template1.setActive(true);
        template1.setDefault(true);

        templateRepository.save(template1);

        // Create sample roles
        Role role1 = new Role();
        role1.setId("role-1");
        role1.setName("Administrator");
        role1.setDescription("Full access to all project features");
        role1.setIcon("shield");
        role1.setColor("#FF6B6B");
        role1.setPermissions(Arrays.asList("manage-project", "manage-users", "create-issues", "edit-issues"));
        role1.setProjectId("project-1");
        role1.setOrganizationId("org-1");
        role1.setCreatedById("user-1");
        role1.setCreatedAt(new Date());
        role1.setUpdatedAt(new Date());
        role1.setActive(true);
        role1.setDefault(true);

        roleRepository.save(role1);

        // Create sample components
        Component component1 = new Component();
        component1.setId("component-1");
        component1.setName("Frontend");
        component1.setDescription("User interface and client-side functionality");
        component1.setIcon("phone-portrait");
        component1.setColor("#4ECDC4");
        component1.setLeadId("user-1");
        component1.setProjectId("project-1");
        component1.setOrganizationId("org-1");
        component1.setIssueCount(12);
        component1.setCreatedAt(new Date());
        component1.setUpdatedAt(new Date());
        component1.setActive(true);
        componentRepository.save(component1);

        System.out.println("Sample data initialized successfully!");
    }
} 