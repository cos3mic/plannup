package planup.backend.mapper;

import planup.backend.dto.ProjectRequest;
import planup.backend.dto.ProjectResponse;
import planup.backend.model.Project;

public class ProjectMapper {
    public static Project toEntity(ProjectRequest req) {
        Project p = new Project();
        p.setName(req.getName());
        p.setKey(req.getKey());
        p.setDescription(req.getDescription());
        p.setLead(req.getLeadId());
        p.setTemplate(req.getTemplateId());
        p.setColor(req.getColor());
        return p;
    }
    public static ProjectResponse toResponse(Project p) {
        ProjectResponse res = new ProjectResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setKey(p.getKey());
        res.setDescription(p.getDescription());
        res.setLeadId(p.getLead());
        res.setTemplateId(p.getTemplate());
        res.setColor(p.getColor());
        return res;
    }
}
